import { betterAuth } from 'better-auth'
import { reactStartCookies } from 'better-auth/react-start'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '~/db'
import * as schema from '~/db/schema'
import { user as userTable, reviews, vendors } from '~/db/schema'
import { eq, sql, avg, count } from 'drizzle-orm'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Peptide Directory <noreply@nicholasalevras.com>',
        to: user.email,
        subject: 'Reset your password',
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="100%" style="max-width:460px;background:#ffffff;border-radius:12px;overflow:hidden">
        <tr><td style="padding:32px 32px 0">
          <p style="margin:0 0 4px;font-size:20px;font-weight:600;color:#171717">Reset your password</p>
          <p style="margin:0 0 24px;font-size:14px;color:#737373">Hi ${user.name}, we received a request to reset your password.</p>
          <a href="${url}" style="display:inline-block;background:#171717;color:#ffffff;font-size:14px;font-weight:500;padding:10px 24px;border-radius:9999px;text-decoration:none">Reset Password</a>
          <p style="margin:24px 0 0;font-size:12px;color:#a3a3a3;line-height:1.5">If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>
        </td></tr>
        <tr><td style="padding:24px 32px 32px">
          <p style="margin:0;font-size:12px;color:#d4d4d4">Peptide Directory</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim(),
      }).catch((err) => console.error('[email] Failed to send reset email:', err))
    },
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      username: {
        type: 'string' as const,
        required: true,
        input: true,
      },
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/email': { window: 3600, max: 5 },
      '/sign-up/email': { window: 3600, max: 3 },
      '/forget-password': { window: 3600, max: 3 },
      '/change-password': { window: 3600, max: 5 },
      '/reset-password': { window: 3600, max: 5 },
      '/delete-user': { window: 3600, max: 2 },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        before: (async (user: any) => {
          // Fallback name for OAuth users with no name
          if (!user.name) {
            user.name = (user.email as string).split('@')[0] || 'User'
          }
          // If no username provided (e.g. OAuth), generate from email
          if (!user.username) {
            const base = (user.email as string).split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '')
            user.username = base || `user${Date.now()}`
          }
          // Enforce minimum length
          if ((user.username as string).length < 2) {
            user.username = `${user.username}_${Date.now().toString(36)}`
          }
          // Enforce maximum length
          if ((user.username as string).length > 30) {
            user.username = (user.username as string).slice(0, 30)
          }
          // Ensure username uniqueness with retry loop
          let desired = user.username as string
          for (let attempt = 0; attempt < 5; attempt++) {
            const existing = await db
              .select({ id: userTable.id })
              .from(userTable)
              .where(eq(sql`lower(${userTable.username})`, desired.toLowerCase()))
              .limit(1)
            if (existing.length === 0) {
              user.username = desired
              break
            }
            // Append random suffix and retry
            const suffix = crypto.randomUUID().slice(0, 6)
            desired = `${(user.username as string).slice(0, 23)}_${suffix}`
          }
          return user
        }) as any,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [reactStartCookies()], // must be last
})

// Helper: recalculate vendor ratings after user deletion cascade
export async function recalcAllVendorRatings(vendorIds: string[]) {
  for (const vendorId of vendorIds) {
    const [result] = await db
      .select({
        avgRating: avg(reviews.rating),
        total: count(reviews.id),
      })
      .from(reviews)
      .where(eq(reviews.vendorId, vendorId))

    await db
      .update(vendors)
      .set({
        rating: result.avgRating ? parseFloat(String(result.avgRating)) : 0,
        reviewCount: result.total,
        updatedAt: new Date(),
      })
      .where(eq(vendors.id, vendorId))
  }
}
