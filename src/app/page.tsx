import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { checkPermission } from '@/app/actions/rbac';

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?reauth=1');
  }

  // ROLE & PERMISSION BASED REDIRECTS
  const role = session.user.role?.toLowerCase();

  // 1. Admins should not be auto-redirected to specific functional dashboards (they likely want the Menu)
  if (!session.user.isAdmin && role !== 'admin' && role !== 'super_admin') {

    // 2. Doctor Access
    if (await checkPermission('hms:dashboard:doctor')) {
      redirect('/hms/doctor/dashboard');
    }

    // 3. Nurse Access
    if (await checkPermission('hms:dashboard:nurse')) {
      redirect('/hms/nursing/dashboard');
    }

    // 4. Reception Access
    if (await checkPermission('hms:dashboard:reception')) {
      redirect('/hms/reception/dashboard');
    }
  }

  console.log('[DEBUG] Root Router:', {
    user: session.user.email,
    tenant: session.user.tenantId,
    sessionFlags: { hms: session.user.hasHMS, crm: session.user.hasCRM }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { tenantId } = session.user as any;
  let industry = '';
  // Check Industry
  if (tenantId) {
    const company = await prisma.company.findFirst({ where: { tenant_id: tenantId } });
    industry = company?.industry || '';
  }

  // Check Active Modules
  const tenantModules = await prisma.tenant_module.findMany({
    where: { tenant_id: tenantId, enabled: true },
    select: { module_key: true }
  });
  const moduleKeys = tenantModules.map(m => m.module_key);

  console.log('[DEBUG] DB Check:', { industry, moduleKeys });

  const isHealthcare = !industry || industry === 'Healthcare' || industry === 'Hospital';
  const hasCRM = moduleKeys.includes('crm');
  const hasHMS = moduleKeys.includes('hms');

  // Decision Logic:
  // Prioritize CRM if explicit, then HMS if explicit.

  // 1. If CRM is present AND User has Access, go CRM.
  if (hasCRM && await checkPermission('crm:view')) {
    redirect('/crm/dashboard');
  }

  // 2. If HMS is present AND User has Access, go HMS.
  if (hasHMS && await checkPermission('hms:view')) {
    redirect('/hms/dashboard');
  }

  // 3. Fallback based on Industry (Legacy behavior)
  // Only if NO specific module is found in DB.
  if (!hasCRM && !hasHMS) {
    if (isHealthcare) redirect('/hms/dashboard');
  }

  // 4. Default fallback (if industry is not Healthcare/Hospital but no modules found either)
  // Default to CRM as a safer modern landing or login?
  redirect('/crm/dashboard');

  // 5. Absolute fallback
  redirect('/hms/dashboard');
}
