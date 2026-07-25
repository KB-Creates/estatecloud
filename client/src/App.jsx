import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google'
import { DashboardLayout } from "@/layouts/dashboard-layout"
import DashboardPage from "@/pages/dashboard"
import PropertiesPage from "@/pages/properties"
import AddPropertyPage from "@/pages/add-property"
import UnitsPage from "@/pages/units"
import ContractsPage from "@/pages/contracts"
import LeadsPage from "@/pages/leads"
import BookingsPage from "@/pages/bookings"
import MaintenancePage from "@/pages/maintenance"
import AddMaintenancePage from "@/pages/add-maintenance"
import AddBookingPage from "@/pages/add-booking"
import PaymentsPage from "@/pages/payments"
import AddPaymentPage from "@/pages/add-payment"
import DueCollectionPage from "@/pages/due-collection"
import ExpensesPage from "@/pages/expenses"
import AnalyticsPage from "@/pages/analytics"
import FinancialReportPage from "@/pages/financial-report"
import AgentsPage from "@/pages/agents"
import OwnersPage from "@/pages/owners"
import StaffPage from "@/pages/staff"
import UsersPage from "@/pages/users"
import CustomersPage from "@/pages/customers"
import AddCustomerPage from "@/pages/add-customer"
import RolesPage from "@/pages/roles"
import CreateRolePage from "@/pages/create-role"
import PayrollPage from "@/pages/payroll"
import ActivitiesPage from "@/pages/activities"
import SettingsPage from "@/pages/settings"
import LoginPage from "@/pages/auth/login"
import SignupPage from "@/pages/auth/signup"
import RegisterCompanyPage from "@/pages/auth/register-company"
import SuperAdminPage from "@/pages/super-admin"
import SubscriptionPage from "@/pages/subscription"
import PropertyDetailsPage from "@/pages/property-details"
import { AuthProvider } from "@/context/AuthContext"
import { SettingsProvider } from "@/context/SettingsContext"
import ProtectedRoute from "@/components/protected-route"
import { TooltipProvider } from "@/components/ui/tooltip"

import HomePage from "@/website/HomePage"
import ConstructionPage from "@/website/ConstructionPage"
import RealEstatePage from "@/website/RealEstatePage"
import BuyingSellingPage from "@/website/BuyingSellingPage"
import ContractorPage from "@/website/ContractorPage"
import ParkViewCityPage from "@/website/ParkViewCityPage"
import BahriaTownPage from "@/website/BahriaTownPage"
import AlNoorOrchardPage from "@/website/AlNoorOrchardPage"
import DHALahorePage from "@/website/DHALahorePage"
import LahoreMeadowsCityPage from "@/website/LahoreMeadowsCityPage"
import ContactPage from "@/website/ContactPage"
import AboutPage from "@/website/AboutPage"
import AnimatedLogoDemo from "@/components/ui/animated-logo-demo"

export default function App() {
  return (
    <GoogleOAuthProvider clientId="485164447224-1tmh7jsvakeq8cvq30p4hbvlp7t1nrru.apps.googleusercontent.com">
      <AuthProvider>
        <SettingsProvider>
          <TooltipProvider>
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/logo-demo" element={<AnimatedLogoDemo />} />
              <Route path="/services/construction-development" element={<ConstructionPage />} />
              <Route path="/services/real-estate-consultant" element={<RealEstatePage />} />
              <Route path="/services/buying-selling" element={<BuyingSellingPage />} />
              <Route path="/services/contractor" element={<ContractorPage />} />
              <Route path="/societies/park-view-city" element={<ParkViewCityPage />} />
              <Route path="/societies/bahria-town" element={<BahriaTownPage />} />
              <Route path="/societies/al-noor-orchard" element={<AlNoorOrchardPage />} />
              <Route path="/societies/dha-lahore" element={<DHALahorePage />} />
              <Route path="/societies/lahore-meadows-city" element={<LahoreMeadowsCityPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/register-company" element={<RegisterCompanyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/super-admin" element={<SuperAdminPage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/properties/:id" element={<PropertyDetailsPage />} />
                  <Route path="/add-property" element={<AddPropertyPage />} />
                  <Route path="/add-property/:id" element={<AddPropertyPage />} />
                  <Route path="/units" element={<UnitsPage />} />
                  <Route path="/contracts" element={<ContractsPage />} />
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/bookings/new" element={<AddBookingPage />} />
                  <Route path="/bookings/edit/:id" element={<AddBookingPage />} />
                  <Route path="/maintenance" element={<MaintenancePage />} />
                  <Route path="/maintenance/new" element={<AddMaintenancePage />} />
                  <Route path="/maintenance/edit/:id" element={<AddMaintenancePage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/payments/new" element={<AddPaymentPage />} />
                  <Route path="/payments/edit/:id" element={<AddPaymentPage />} />
                  <Route path="/due-collection" element={<DueCollectionPage />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/financial-report" element={<FinancialReportPage />} />
                  <Route path="/agents" element={<AgentsPage />} />
                  <Route path="/owners" element={<OwnersPage />} />
                  <Route path="/staff" element={<StaffPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/customers/new" element={<AddCustomerPage />} />
                  <Route path="/customers/edit/:id" element={<AddCustomerPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/roles/create" element={<CreateRolePage />} />
                  <Route path="/roles/edit/:id" element={<CreateRolePage />} />
                  <Route path="/payroll" element={<PayrollPage />} />
                  <Route path="/activities" element={<ActivitiesPage />} />
                  <Route path="/account" element={<Navigate to="/settings" replace />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </SettingsProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

