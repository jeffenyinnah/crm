import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  const { id } = evt.data
  const eventType = evt.type
  
  if (typeof id !== 'string') {
    console.error('Invalid or missing user ID in webhook payload');
    return new Response('Invalid user ID', { status: 400 });
  }

  try {
    const userRef = doc(db, 'users', id);

    if (eventType === 'user.created') {
      await setDoc(userRef, {
        email: evt.data.email_addresses?.[0]?.email_address ?? '',
        firstName: evt.data.first_name ?? '',
        lastName: evt.data.last_name ?? '',
        userId: id,
        createdAt: evt.data.created_at ?? new Date().toISOString(),
        updatedAt: evt.data.updated_at ?? new Date().toISOString(),
        role: 'user',
        profilePicture: evt.data.image_url ?? '',
      });
    } else if (eventType === 'user.updated') {
      await updateDoc(userRef, {
        email: evt.data.email_addresses?.[0]?.email_address ?? '',
        firstName: evt.data.first_name ?? '',
        lastName: evt.data.last_name ?? '',
        updatedAt: evt.data.updated_at ?? new Date().toISOString(),
      });
    } else if (eventType === 'user.deleted') {
      await deleteDoc(userRef);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }

  return new Response('', { status: 200 })
}