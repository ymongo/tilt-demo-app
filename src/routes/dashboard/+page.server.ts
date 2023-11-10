import { UserApplianceSchema, type UserAppliance } from '$lib/models/appliance.js';
import { fail, redirect } from '@sveltejs/kit';
import camelize from 'camelize-ts';
import { v4 as uuidv4 } from 'uuid';
import type { UserAppliance as UserApplianceType } from '$lib/models/appliance.js';

export const load = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, '/');
  }

  let { data: appliancesInfo } = await supabase.from('appliances_info').select(`*`);
  appliancesInfo = camelize(appliancesInfo);

  const { data: profile } = await supabase
    .from('profiles')
    .select(`username, appliances`)
    .eq('id', session.user.id)
    .single();

  let totalConsumed = 0;
  if (profile?.appliances) {
    totalConsumed = profile.appliances.reduce(
      (a: number, b: UserApplianceType) => a + b.power * b.workingHours,
      0
    );
  }
  return { session, profile, appliancesInfo, totalConsumed };
};

export const actions = {
  update: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    console.log(formData, 'form');
    const username = formData.get('username') as string;
    const appliances = JSON.parse(formData.get('appliances') as string);
    console.log(appliances, 'test');
    const session = await getSession();

    const { error } = await supabase.from('profiles').upsert({
      id: session?.user.id,
      username,
      appliances,
      updated_at: new Date()
    });

    if (error) {
      return fail(500, {
        username
      });
    }

    return {
      username
    };
  },

  signout: async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (session) {
      await supabase.auth.signOut();
      throw redirect(303, '/');
    }
  },

  addappliance: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    const newAppliance: UserAppliance = {
      id: uuidv4(),
      name: formData.get('appliance-name') as string,
      type: JSON.parse(formData.get('appliance-type'))['type'] as string,
      category: JSON.parse(formData.get('appliance-type'))['category'] as string,
      power: Number(formData.get('appliance-power')),
      workingHours: Number(formData.get('appliance-working-hours'))
    };
    UserApplianceSchema.parse(newAppliance);

    const session = await getSession();
    const data = await supabase.rpc('append_appliance', { new_appliance: newAppliance });
    // console.log(data);
    return { newAppliance };
  }
};
