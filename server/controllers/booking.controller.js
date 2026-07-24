import prisma from '../lib/prisma.js';
import { createNotification } from './notification.controller.js';
import { sendSMS } from '../utils/sms.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

export const createBooking = async (req, res) => {
  try {
    const body = { ...req.body };

    const booking = await prisma.booking.create({
      data: {
        customerName: body.customerName,
        email: body.email || null,
        phone: body.phone,
        agent: body.agent || null,
        status: body.status || 'Pending Request',
        totalPrice: Number(body.totalPrice || 0),
        tokenAmount: Number(body.tokenAmount || 0),
        advancePayment: Number(body.advancePayment || 0),
        remainingAmount: Number(body.remainingAmount || 0),
        notes: body.notes || null,
        userId: req.user.id,
        propertyId: body.property || body.propertyId,
        unitId: body.unit || body.unitId || null,
      }
    });

    if (booking.status === 'Confirmed' && booking.unitId) {
      await prisma.unit.update({
        where: { id: booking.unitId },
        data: { status: 'Occupied' }
      });
    }

    await createNotification({
      userId: req.user.id,
      title: 'New Booking Created',
      description: `New booking for ${booking.customerName} created on property.`,
      type: 'property',
      link: '/bookings',
      metadata: { bookingId: booking.id }
    });

    // Send Twilio SMS Alert
    if (booking.phone) {
      try {
        await sendSMS({
          to: booking.phone,
          body: `Hi ${booking.customerName}, your booking request has been received. Status: ${booking.status}. Thank you!`,
          userId: req.user.id
        });
      } catch (smsErr) {
        console.error('Error sending booking SMS:', smsErr.message);
      }
    }

    res.status(201).json(fmt(booking));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        property: { select: { id: true, title: true } },
        unit: { select: { id: true, unitNumber: true, block: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const existing = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!existing) return res.status(404).json({ message: 'Booking not found' });

    const body = { ...req.body };
    delete body.id;
    delete body._id;
    delete body.userId;

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: body
    });

    if (body.status === 'Confirmed' && booking.unitId) {
      await prisma.unit.update({ where: { id: booking.unitId }, data: { status: 'Occupied' } });
    } else if ((body.status === 'Completed' || body.status === 'Cancelled') && booking.unitId) {
      await prisma.unit.update({ where: { id: booking.unitId }, data: { status: 'Available' } });
    }

    // Booking notifications
    if (body.status && body.status !== existing.status) {
      if (body.status === 'Confirmed') {
        await createNotification({
          userId: booking.userId,
          title: 'Booking Approved',
          description: `Booking for ${booking.customerName} has been approved.`,
          type: 'property',
          link: '/bookings',
          metadata: { bookingId: booking.id }
        });
      } else if (body.status === 'Cancelled') {
        await createNotification({
          userId: booking.userId,
          title: 'Booking Cancelled',
          description: `Booking for ${booking.customerName} has been cancelled.`,
          type: 'property',
          link: '/bookings',
          metadata: { bookingId: booking.id }
        });
      }
    } else {
      await createNotification({
        userId: booking.userId,
        title: 'Booking Modified',
        description: `Booking details for ${booking.customerName} were updated.`,
        type: 'property',
        link: '/bookings',
        metadata: { bookingId: booking.id }
      });
    }

    res.json(fmt(booking));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (booking) {
      if (booking.unitId) {
        await prisma.unit.update({ where: { id: booking.unitId }, data: { status: 'Available' } });
      }
      await prisma.booking.delete({ where: { id: req.params.id } });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
