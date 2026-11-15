const https = require('https');

const projectId = 'wastram-a7300';
const apiKey = 'AIzaSyBB62kPVeyIFKv4llhEnfNGSbVuwG46dvA';

async function listDocuments(collection) {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}?key=${apiKey}&pageSize=300`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching product_overrides...');
  const res = await listDocuments('product_overrides');
  if (res.documents) {
    console.log(`Found ${res.documents.length} overrides in product_overrides:`);
    for (const doc of res.documents) {
      const docName = doc.name.split('/').pop();
      const fields = doc.fields || {};
      const name = fields.name?.stringValue || '(no name)';
      const cat = fields.category?.stringValue || fields.category_id?.stringValue || '(no cat)';
      const partNumber = fields.partNumber?.stringValue || '(no part)';
      const deleted = fields.deleted?.booleanValue;
      console.log(`- ID: ${docName} | Name: "${name}" | Cat: "${cat}" | Part: "${partNumber}" | Deleted: ${deleted}`);
    }
  } else {
    console.log('No documents or error:', res);
  }

  console.log('\nFetching orders/_products_store/products...');
  const storeRes = await listDocuments('orders/_products_store/products');
  if (storeRes.documents) {
    console.log(`Found ${storeRes.documents.length} in orders/_products_store/products:`);
    for (const doc of storeRes.documents) {
      const docName = doc.name.split('/').pop();
      const fields = doc.fields || {};
      const name = fields.name?.stringValue || '(no name)';
      const cat = fields.category?.stringValue || fields.category_id?.stringValue || '(no cat)';
      console.log(`- Store doc: ${docName} | Name: "${name}" | Cat: "${cat}"`);
    }
  } else {
    console.log('Store response:', storeRes);
  }
}

run();
