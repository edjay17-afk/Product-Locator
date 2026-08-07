const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const seedPath = path.join(__dirname, '..', 'seed-data.json');
let memoryProducts = [];
let isConnectedToFirebase = false;
let db = null;

function loadSeedData() {
  if (fs.existsSync(seedPath)) {
    try {
      const raw = fs.readFileSync(seedPath, 'utf8');
      const items = JSON.parse(raw);
      return items.map((p, idx) => ({
        id: String(idx + 1),
        barcode: p.b || '',
        stock_code: p.s || '',
        name: p.n || 'Unnamed item',
        category: p.c || '',
        subcategory: p.sc || '',
        floor: p.floor || '',
        batch: p.batch || '',
        shelf: p.shelf || '',
        level: p.level || '',
        loc: p.loc || '',
        loc_full: p.locFull || '',
        qty: typeof p.qty === 'number' ? p.qty : 0,
        status: p.status || '',
        custom: p.custom ? true : false
      }));
    } catch (e) {
      console.warn('Could not read seed-data.json:', e);
    }
  }
  return [];
}

memoryProducts = loadSeedData();

// Connect to Firebase Admin SDK
function initFirebase() {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_CREDENTIALS;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!serviceAccountEnv && !projectId) {
    console.log('⚡ FIREBASE_SERVICE_ACCOUNT not set. Running in In-Memory / Netlify Fallback mode.');
    return false;
  }

  if (admin.apps.length > 0) {
    db = admin.firestore();
    isConnectedToFirebase = true;
    return true;
  }

  try {
    let credential;
    if (serviceAccountEnv) {
      const parsed = typeof serviceAccountEnv === 'string' && serviceAccountEnv.startsWith('{')
        ? JSON.parse(serviceAccountEnv)
        : JSON.parse(fs.readFileSync(serviceAccountEnv, 'utf8'));

      credential = admin.credential.cert(parsed);
    } else {
      credential = admin.credential.applicationDefault();
    }

    admin.initializeApp({
      credential,
      projectId: projectId || (credential && credential.projectId)
    });

    db = admin.firestore();
    isConnectedToFirebase = true;
    console.log('🔥 Connected to Firebase Firestore successfully!');
    seedFirestoreIfEmpty();
    return true;
  } catch (err) {
    console.warn('Failed to initialize Firebase Admin SDK:', err.message);
    isConnectedToFirebase = false;
    return false;
  }
}

async function seedFirestoreIfEmpty() {
  if (!db) return;
  try {
    const snapshot = await db.collection('products').limit(1).get();
    if (snapshot.empty) {
      console.log('Seeding initial 940 products into Firebase Firestore...');
      const seedItems = memoryProducts;
      const batchSize = 400; // Firestore batch limit is 500
      for (let i = 0; i < seedItems.length; i += batchSize) {
        const batch = db.batch();
        const chunk = seedItems.slice(i, i + batchSize);
        chunk.forEach(item => {
          const docRef = db.collection('products').doc(String(item.id));
          batch.set(docRef, {
            barcode: item.barcode,
            stock_code: item.stock_code,
            name: item.name,
            category: item.category,
            subcategory: item.subcategory,
            floor: item.floor,
            batch: item.batch,
            shelf: item.shelf,
            level: item.level,
            loc: item.loc,
            loc_full: item.loc_full,
            qty: item.qty,
            status: item.status,
            custom: item.custom,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        });
        await batch.commit();
      }
      console.log(`🎉 Firebase Firestore successfully seeded with 940 products!`);
    }
  } catch (err) {
    console.error('Firestore seeding error:', err);
  }
}

initFirebase();

module.exports = {
  getAllProducts: async () => {
    if (isConnectedToFirebase && db) {
      const snapshot = await db.collection('products').get();
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    }
    return memoryProducts;
  },
  searchProducts: async (query, limit = 20) => {
    const q = (query || '').trim().toLowerCase();
    if (isConnectedToFirebase && db) {
      // In Firestore, fetch and filter matching products
      const snapshot = await db.collection('products').get();
      const matches = [];
      snapshot.forEach(doc => {
        const p = doc.data();
        const name = (p.name || '').toLowerCase();
        const barcode = (p.barcode || '').toLowerCase();
        const stock = (p.stock_code || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const subcat = (p.subcategory || '').toLowerCase();

        if (name.includes(q) || barcode.includes(q) || stock.includes(q) || cat.includes(q) || subcat.includes(q)) {
          matches.push({ id: doc.id, ...p });
        }
      });
      return matches.slice(0, limit);
    }

    return memoryProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.barcode.toLowerCase().includes(q) ||
      p.stock_code.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
    ).slice(0, limit);
  },
  getProductByBarcodeOrStock: async (code) => {
    const clean = (code || '').trim().toLowerCase();
    if (isConnectedToFirebase && db) {
      let snapshot = await db.collection('products').where('barcode', '==', clean).limit(1).get();
      if (snapshot.empty) {
        snapshot = await db.collection('products').where('stock_code', '==', clean).limit(1).get();
      }
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    }
    return memoryProducts.find(p => p.barcode.toLowerCase() === clean || p.stock_code.toLowerCase() === clean);
  },
  getProductById: async (id) => {
    if (isConnectedToFirebase && db) {
      const doc = await db.collection('products').doc(String(id)).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    }
    return memoryProducts.find(p => String(p.id) === String(id));
  },
  createProduct: async (data) => {
    if (isConnectedToFirebase && db) {
      const docRef = db.collection('products').doc();
      const payload = {
        barcode: data.barcode || '',
        stock_code: data.stock_code || '',
        name: data.name,
        category: data.category || 'Uncategorized',
        subcategory: data.subcategory || '',
        floor: data.floor || '1',
        batch: data.batch || '',
        shelf: data.shelf || '',
        level: data.level || '00',
        loc: data.loc || '',
        loc_full: data.loc_full || '',
        qty: parseInt(data.qty || 0, 10),
        status: data.status || 'DONE',
        custom: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await docRef.set(payload);
      return { id: docRef.id, ...payload };
    }

    const newProduct = {
      id: String(memoryProducts.length + 1),
      barcode: data.barcode || '',
      stock_code: data.stock_code || '',
      name: data.name,
      category: data.category || 'Uncategorized',
      subcategory: data.subcategory || '',
      floor: data.floor || '1',
      batch: data.batch || '',
      shelf: data.shelf || '',
      level: data.level || '00',
      loc: data.loc || '',
      loc_full: data.loc_full || '',
      qty: parseInt(data.qty || 0, 10),
      status: data.status || 'DONE',
      custom: true
    };
    memoryProducts.push(newProduct);
    return newProduct;
  },
  updateProduct: async (id, data) => {
    if (isConnectedToFirebase && db) {
      const docRef = db.collection('products').doc(String(id));
      await docRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    }

    const item = memoryProducts.find(p => String(p.id) === String(id));
    if (item) {
      Object.assign(item, data);
    }
    return item;
  },
  deleteProduct: async (id) => {
    if (isConnectedToFirebase && db) {
      await db.collection('products').doc(String(id)).delete();
      return true;
    }
    const len = memoryProducts.length;
    memoryProducts = memoryProducts.filter(p => String(p.id) !== String(id));
    return memoryProducts.length < len;
  },
  getStats: async () => {
    if (isConnectedToFirebase && db) {
      const snapshot = await db.collection('products').get();
      let customCount = 0;
      snapshot.forEach(doc => {
        if (doc.data().custom) customCount++;
      });
      return { total: snapshot.size, customCount, isFirebase: true };
    }
    return {
      total: memoryProducts.length,
      customCount: memoryProducts.filter(p => p.custom).length,
      isFirebase: false
    };
  }
};
