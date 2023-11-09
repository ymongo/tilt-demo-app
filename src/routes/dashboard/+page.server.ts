import { fail, redirect } from '@sveltejs/kit';
import camelize from 'camelize-ts';

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

  return { session, profile, appliancesInfo };
};

export const actions = {
  update: async ({ request, locals: { supabase, getSession } }) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;

    const session = await getSession();

    const { error } = await supabase.from('profiles').upsert({
      id: session?.user.id,
      username,
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
  }
};
