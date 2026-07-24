import prisma from '../lib/prisma.js';
import { createNotification } from './notification.controller.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

export const createInquiry = async (req, res) => {
  try {
    const body = { ...req.body };

    const inquiry = await prisma.inquiry.create({
      data: {
        name: body.name,
        phone: body.phone,
        propertyType: body.propertyType || null,
        purpose: body.purpose || null,
        budget: body.budget || null,
        city: body.city || null,
        status: body.status || 'New',
        priority: body.priority || 'Medium',
        remarks: body.remarks || '',
        nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : null,
        statusHistory: [
          {
            status: body.status || 'New',
            remarks: body.remarks || 'Lead created.',
            nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : null,
            updatedAt: new Date(),
            updatedBy: req.user.name || 'System'
          }
        ],
        userId: req.user.id,
        assignedToId: body.assignedTo || null,
      }
    });

    await createNotification({
      userId: req.user.id,
      title: 'New Lead Received',
      description: `New lead from ${inquiry.name} for ${inquiry.propertyType || 'property'}`,
      type: 'property',
      link: '/inquiries',
      metadata: { inquiryId: inquiry.id }
    });

    req.io?.emit('inquiries_updated', { action: 'create', data: inquiry });
    res.status(201).json(fmt(inquiry));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkCreateInquiries = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: 'No leads provided' });
    }

    const leads = req.body.map(lead => ({
      name: lead.name,
      phone: lead.phone,
      propertyType: lead.propertyType || null,
      purpose: lead.purpose || null,
      budget: lead.budget || null,
      city: lead.city || null,
      priority: lead.priority || 'Medium',
      status: lead.status || 'New',
      userId: req.user.id,
    }));

    const inserted = await prisma.inquiry.createMany({ data: leads });

    await createNotification({
      userId: req.user.id,
      title: 'Bulk Leads Imported',
      description: `${inserted.count} leads were successfully imported.`,
      type: 'property',
      link: '/inquiries'
    });

    req.io?.emit('inquiries_updated', { action: 'bulkCreate' });
    res.status(201).json({ count: inserted.count, message: 'Leads imported successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const userRole = req.user.role?.toLowerCase() || 'user';
    const viewScope = req.viewScope || 'own';
    const where = {};

    if (userRole !== 'admin') {
      if (viewScope === 'own') {
        where.OR = [
          { userId: req.user.id },
          { assignedToId: req.user.id }
        ];
      } else if (viewScope === 'none') {
        return res.status(403).json({ message: 'Access denied' });
      }
      // If viewScope is 'all', where remains empty so they see ALL inquiries!
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(inquiries.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInquiry = async (req, res) => {
  try {
    const userRole = req.user.role?.toLowerCase() || 'user';
    const where = { id: req.params.id };

    if (userRole !== 'admin') {
      where.OR = [
        { userId: req.user.id },
        { assignedToId: req.user.id }
      ];
    } else {
      where.userId = req.user.id;
    }

    const existing = await prisma.inquiry.findFirst({
      where
    });
    if (!existing) return res.status(404).json({ message: 'Inquiry not found' });

    const body = { ...req.body };
    delete body.id;
    delete body._id;
    delete body.userId;
    if (body.assignedTo) {
      body.assignedToId = body.assignedTo;
      delete body.assignedTo;
    }

    // Convert nextFollowUp to Date object if present
    if (body.nextFollowUp) {
      body.nextFollowUp = new Date(body.nextFollowUp);
    } else if (body.hasOwnProperty('nextFollowUp')) {
      body.nextFollowUp = null;
    }

    // Build status history update
    let updatedHistory = existing.statusHistory;
    if (typeof updatedHistory === 'string') {
      try {
        updatedHistory = JSON.parse(updatedHistory);
      } catch (e) {
        updatedHistory = [];
      }
    }
    if (!Array.isArray(updatedHistory)) {
      updatedHistory = [];
    }

    // Check if status, remarks, or followUp has changed
    const statusChanged = body.status !== undefined && body.status !== existing.status;
    const remarksChanged = body.remarks !== undefined && body.remarks !== existing.remarks;
    const followUpChanged = body.nextFollowUp !== undefined && 
      (existing.nextFollowUp ? new Date(body.nextFollowUp).getTime() !== new Date(existing.nextFollowUp).getTime() : body.nextFollowUp !== null);

    if (statusChanged || remarksChanged || followUpChanged) {
      updatedHistory.push({
        status: body.status !== undefined ? body.status : existing.status,
        remarks: body.remarks !== undefined ? body.remarks : (existing.remarks || ''),
        nextFollowUp: body.nextFollowUp !== undefined ? body.nextFollowUp : existing.nextFollowUp,
        updatedAt: new Date(),
        updatedBy: req.user.name || 'System'
      });
      body.statusHistory = updatedHistory;
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id },
      data: body
    });

    // Lead Status Changed notification
    if (body.status && body.status !== existing.status) {
      await createNotification({
        userId: inquiry.userId,
        title: 'Lead Status Changed',
        description: `Lead "${inquiry.name}" status updated to ${inquiry.status}`,
        type: 'property',
        link: '/inquiries',
        metadata: { inquiryId: inquiry.id }
      });
    }

    // Lead Assigned / Lead Assigned To You notifications
    if (body.assignedToId && body.assignedToId !== existing.assignedToId) {
      await createNotification({
        userId: body.assignedToId,
        title: 'Lead Assigned To You',
        description: `Lead "${inquiry.name}" has been assigned to you.`,
        type: 'user',
        link: '/inquiries',
        metadata: { inquiryId: inquiry.id }
      });
      await createNotification({
        userId: inquiry.userId,
        title: 'New Lead Assigned',
        description: `Lead "${inquiry.name}" was successfully assigned.`,
        type: 'property',
        link: '/inquiries',
        metadata: { inquiryId: inquiry.id }
      });
    }

    req.io?.emit('inquiries_updated', { action: 'update', data: inquiry });
    res.json(fmt(inquiry));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const userRole = req.user.role?.toLowerCase() || 'user';
    const where = { id: req.params.id };

    if (userRole !== 'admin') {
      where.userId = req.user.id;
    }

    const existing = await prisma.inquiry.findFirst({
      where
    });
    if (!existing) return res.status(404).json({ message: 'Inquiry not found' });

    await prisma.inquiry.delete({ where: { id: req.params.id } });
    req.io?.emit('inquiries_updated', { action: 'delete', id: req.params.id });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPublicInquiry = async (req, res) => {
  try {
    const body = { ...req.body };

    // Find the admin user azam.asghar26@gmail.com to own this inquiry (since userId is a required field on Inquiry)
    const admin = await prisma.user.findUnique({
      where: { email: 'azam.asghar26@gmail.com' }
    }) || await prisma.user.findFirst({
      where: { role: 'admin' }
    }) || await prisma.user.findFirst();

    if (!admin) {
      return res.status(400).json({ message: 'No system admin user exists to assign the inquiry' });
    }

    const name = `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'Anonymous';
    
    const inquiry = await prisma.inquiry.create({
      data: {
        name: name,
        phone: body.contact || body.phone || 'N/A',
        propertyType: body.propertyType || null,
        purpose: body.purpose || null,
        budget: body.budget || null,
        city: body.city || 'Lahore',
        status: 'New',
        priority: 'Medium',
        remarks: body.message || 'Public Contact Form Submission',
        userId: admin.id,
        statusHistory: [
          {
            status: 'New',
            remarks: 'Submitted via public contact form.',
            updatedAt: new Date(),
            updatedBy: 'Public Contact Form'
          }
        ]
      }
    });

    await createNotification({
      userId: admin.id,
      title: 'New Public Inquiry Received',
      description: `New lead from ${inquiry.name} (${inquiry.phone})`,
      type: 'property',
      link: '/leads',
      metadata: { inquiryId: inquiry.id }
    });

    req.io?.emit('inquiries_updated', { action: 'create', data: inquiry });
    res.status(201).json(fmt(inquiry));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
