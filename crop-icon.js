const sharp = require('sharp');

// Crop the bottom quarter of the icon
async function cropIcon() {
  try {
    // Get the metadata of the image
    const metadata = await sharp('icon.png').metadata();
    const { width, height } = metadata;
    
    // Calculate new height (removing the bottom quarter)
    const newHeight = Math.floor(height * 0.75);
    
    // Crop the image (keeping top 75%)
    await sharp('icon.png')
      .extract({ left: 0, top: 0, width, height: newHeight })
      .toFile('cropped_icon.png');
    
    console.log('Icon cropped successfully!');
  } catch (error) {
    console.error('Error cropping icon:', error);
  }
}

cropIcon(); 