const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedData() {
  const users = [
    {
      id: "12345",
      name: "Roshan",
      passcode: "54321",
      data: {
            subscription: {
        status: "Active",
        end_date: "2025-08-30",
        type: "Prime Annual"
        },
        order: {
        last_order_id: "ORD98765",
        status: "Shipped",
        estimated_delivery: "2025-07-18",
        delivery_partner: "Delhivery",
        shipping_speed: "Express"
        },
        returns: {
        active_returns: 1,
        refund: {
            status: "Processing",
            amount: "$45.99",
            expected_by: "2025-07-20"
        }
        },
        cart: {
        items_in_cart: 3,
        wishlist_count: 5,
        last_update: "2025-07-14"
        },
        rewards: {
        points: 320,
        expiry_date: "2025-08-31",
        tier: "Gold"
        },
        payment: {
        preferred_method: "Credit Card",
        last_method: "UPI"
        },
        address: {
        default: "123 Main Street, Bangalore"
        }
      }
    },
    {
      id: "23456",
      name: "Preethi",
      passcode: "12345",
      data: {
        sales: 9800,
        pending_orders: 2,
        top_product: "Headphones"
      }
    },
    {
      id: "34567",
      name: "Syed",
      passcode: "67890",
      data: {
        sales: 20000,
        pending_orders: 1,
        top_product: "Laptop"
      }
    },
    {
      id: "12345",
      name: "Vishakha",
      passcode: "54321",
      data: {
        sales: 15000,
        pending_orders: 4,
        top_product: "Smartphone"
      }
    },
    {
      id: "23456",
      name: "Rohini",
      passcode: "12345",
      data: {
        sales: 9800,
        pending_orders: 2,
        top_product: "Headphones"
      }
    },
    {
      id: "34567",
      name: "Oscar",
      passcode: "67890",
      data: {
        sales: 20000,
        pending_orders: 1,
        top_product: "Laptop"
      }
    },
    {
      id: "23456",
      name: "maleeha",
      passcode: "12345",
      data: {
        sales: 9800,
        pending_orders: 2,
        top_product: "Headphones"
      }
    },
    {
      id: "34567",
      name: "Balu",
      passcode: "67890",
      data: {
        sales: 20000,
        pending_orders: 1,
        top_product: "Laptop"
      }
    }
  ];

  for (const user of users) {
    await db.collection('users').add(user);
    console.log(`Inserted user: ${user.name}`);
  }

  console.log('Seeding complete.');
  process.exit();
}

seedData();
