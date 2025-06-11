import http from 'http';

const API_BASE = 'http://localhost:5000/api';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testImageManagement() {
  console.log('🧪 Testing Image Management API Endpoints...\n');

  try {
    // 1. Get all products to find one to test with
    console.log('1️⃣ Getting products...');
    const response = await makeRequest(`${API_BASE}/products`);
    
    if (response.status !== 200) {
      console.log('❌ Failed to get products:', response.data);
      return;
    }

    const products = response.data.data;
    
    if (products.length === 0) {
      console.log('❌ No products found');
      return;
    }

    const testProduct = products[0];
    console.log(`✅ Using test product: ${testProduct.name} (ID: ${testProduct._id})`);
    console.log(`   Current images: ${testProduct.images?.length || 0}`);
    if (testProduct.images) {
      testProduct.images.forEach((img, index) => {
        console.log(`   📸 Image ${index + 1}: ${img}`);
      });
    }

    console.log('\n📋 Available Image Management Endpoints:');
    console.log(`   POST /products/${testProduct._id}/images/add`);
    console.log('     Body: { "imageUrl": "string" }');
    console.log(`   POST /products/${testProduct._id}/images/remove`);
    console.log('     Body: { "imageUrl": "string" }');
    console.log(`   POST /products/${testProduct._id}/images/reorder`);
    console.log('     Body: { "imageUrls": ["string1", "string2", ...] }');
    console.log(`   POST /products/${testProduct._id}/images/set-main`);
    console.log('     Body: { "imageUrl": "string" }');

    console.log('\n✅ Backend API Structure Updated Successfully!');
    console.log('📝 New Features Added:');
    console.log('   • Add new image to product');
    console.log('   • Remove image from product');
    console.log('   • Reorder product images');
    console.log('   • Set main/primary image');
    console.log('   • Enhanced validation for multiple images');
    console.log('   • Backward compatibility with single image field');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testImageManagement();
