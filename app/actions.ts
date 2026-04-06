'use server'

export async function subscribeEmail(
  email: string,
  firstName = '',
  lastName = '',
  phone = '',
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX

  if (!apiKey || !listId || !serverPrefix) {
    return { success: false, error: 'Email service not configured.' }
  }

  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        PHONE: phone,
      },
    }),
  })

  const data = await response.json()

  if (response.ok) {
    return { success: true }
  }

  if (data.title === 'Member Exists') {
    return { success: true }
  }

  console.error('Mailchimp error:', data)
  return { success: false, error: data.detail ?? 'Something went wrong. Please try again.' }
}
