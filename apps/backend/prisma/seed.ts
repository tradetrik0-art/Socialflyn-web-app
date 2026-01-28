import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Socialflyn Demo',
      slug: 'socialflyn-demo',
    },
  });
  console.log('✅ Tenant created:', tenant.id);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@socialflyn.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

  // Create client user
  const clientUser = await prisma.user.create({
    data: {
      email: 'client@example.com',
      name: 'John Doe',
      password: await bcrypt.hash('client123', 10),
      role: 'CLIENT',
    },
  });
  console.log('✅ Client user created:', clientUser.email);

  // Create sample client
  const client = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Tech Startup Inc.',
      industry: 'Technology',
      platforms: ['instagram', 'facebook', 'linkedin'],
      monthlyBudget: 5000,
      packageType: 'SOCIAL_MEDIA_MANAGEMENT',
      status: 'ACTIVE',
      user: { connect: { id: clientUser.id } },
    },
  });
  console.log('✅ Client created:', client.name);

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        clientId: client.id,
        caption: '🚀 Excited to announce our new product launch! Join us in revolutionizing the tech industry.',
        hashtags: '#tech #innovation #startup #productlaunch #AI',
        status: 'PUBLISHED',
        likes: 342,
        comments: 28,
        shares: 15,
        publishedAt: new Date(),
      },
    }),
    prisma.post.create({
      data: {
        clientId: client.id,
        caption: '💡 Behind the scenes: How our team builds amazing products every single day.',
        hashtags: '#behindthescenes #teamwork #startup #culturefirst',
        status: 'APPROVED',
      },
    }),
    prisma.post.create({
      data: {
        clientId: client.id,
        caption: '📊 2024 Industry Report: What you need to know about digital transformation.',
        hashtags: '#industry #report #digitaltransformation #future #tech',
        status: 'DRAFT',
      },
    }),
  ]);
  console.log('✅ Posts created:', posts.length);

  // Create AI growth plan
  const aiPlan = await prisma.aIPlan.create({
    data: {
      clientId: client.id,
      planType: 'THIRTY_SIXTY_NINETY',
      content: {
        day30: {
          tactics: [
            'Establish brand presence on 3 platforms',
            'Launch 22 targeted posts',
            'Engage with 50+ similar accounts daily',
          ],
          expectedMetrics: {
            followers: 5000,
            engagement_rate: 8,
            reach: 100000,
          },
        },
        day60: {
          tactics: [
            'Introduce paid ads strategy',
            'Collaborate with micro-influencers',
            'Launch weekly webinar series',
          ],
          expectedMetrics: {
            followers: 12000,
            engagement_rate: 12,
            reach: 350000,
          },
        },
        day90: {
          tactics: [
            'Scale paid ad budget by 50%',
            'Launch community building initiatives',
            'Measure ROAS and optimize campaigns',
          ],
          expectedMetrics: {
            followers: 25000,
            engagement_rate: 15,
            reach: 800000,
            estimated_leads: 500,
          },
        },
      },
      status: 'active',
    },
  });
  console.log('✅ AI Growth Plan created');

  // Create sample automation leads
  const leads = await Promise.all([
    prisma.automationLead.create({
      data: {
        clientId: client.id,
        source: 'FORM_SUBMISSION',
        data: {
          name: 'Sarah Johnson',
          email: 'sarah@techcompany.com',
          phone: '+19021877385',
          company: 'TechCorp LLC',
          industry: 'Software',
        },
        status: 'NEW',
        sequenceState: {
          last_email_day: 0,
          last_whatsapp_day: 0,
          status: 'pending',
        },
      },
    }),
    prisma.automationLead.create({
      data: {
        clientId: client.id,
        source: 'CSV_UPLOAD',
        data: {
          name: 'Mike Chen',
          email: 'mike@ecommerce.io',
          phone: '+19021877386',
          company: 'EcommercePro',
          industry: 'E-commerce',
        },
        status: 'CONTACTED',
        lastContacted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        sequenceState: {
          last_email_day: 1,
          last_whatsapp_day: 1,
          status: 'in_progress',
        },
      },
    }),
    prisma.automationLead.create({
      data: {
        clientId: client.id,
        source: 'LEAD_MAGNET',
        data: {
          name: 'Emma White',
          email: 'emma@agency.com',
          phone: '+19021877387',
          company: 'Digital Agency Co',
          industry: 'Marketing',
        },
        status: 'CONVERTED',
        lastContacted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        sequenceState: {
          last_email_day: 7,
          last_whatsapp_day: 7,
          status: 'completed',
        },
      },
    }),
  ]);
  console.log('✅ Sample leads created:', leads.length);

  // Create outreach sequence
  const sequence = await prisma.outreachSequence.create({
    data: {
      tenantId: tenant.id,
      name: 'Default Cold Outreach',
      channel: 'EMAIL',
      templates: {
        day1: 'Hi {{name}},\n\nI noticed your {{company}} is in {{industry}}. We help companies like yours grow their reach 3x faster.\n\nWould you be open to a quick 15-min chat?\n\nBest regards,\nSocialflyn Team',
        day3: 'Hi {{name}},\n\nFollowing up on my previous message - did you get a chance to check it out?\n\nI have some specific insights for {{company}}.\n\nLooking forward to connecting!',
        day7: 'Hi {{name}},\n\nLast chance to join 100+ companies scaling with Socialflyn.\n\nLet\'s talk this week?\n\nBest,\nSocialflyn',
      },
      followupSchedule: {
        day1_delay_hours: 0,
        day3_delay_hours: 48,
        day7_delay_hours: 144,
      },
      isActive: true,
    },
  });
  console.log('✅ Outreach sequence created');

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
