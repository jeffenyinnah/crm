import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";


export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
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
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data
  const eventType = evt.type

  //Create user in Firebase
  if (evt.data && 'id' in evt.data) {
    const { id } = evt.data;
    const usersCollectionRef = collection(db, 'users');
    const userRef = doc(usersCollectionRef, id);

    switch (evt.type) {
      case 'user.created':
        if ('email_addresses' in evt.data && 'image_url' in evt.data && 'first_name' in evt.data && 'last_name' in evt.data) {
          await setDoc(userRef, {
            userId: id,
            email: evt.data.email_addresses[0]?.email_address,
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
            photo: evt.data.image_url,
            createdAt: new Date(),
          });
        }
        break;

      case 'user.updated':
        if ('email_addresses' in evt.data && 'image_url' in evt.data && 'first_name' in evt.data && 'last_name' in evt.data) {
          await updateDoc(userRef, {
            email: evt.data.email_addresses[0]?.email_address,
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
            photo: evt.data.image_url,
            updatedAt: new Date(),
          });
        }
        break;

      case 'user.deleted':
        await deleteDoc(userRef);
        break;

      default:
        console.log(`Unhandled event type: ${evt.type}`);
    }
  } else {
    console.log('Invalid event data structure');
  }
  

  
    

  return new Response('', { status: 200 })
}