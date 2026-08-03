const fs = require('fs');
const html = fs.readFileSync('infopace.html', 'utf8');

let match = html.match(/<img[^>]+src="([^"]+(?:logo|infopace)[^"]*\.(?:png|svg|jpg))"[^>]*>/i);
if (match) {
  console.log(match[1]);
} else {
  // Broader search
  let allImgs = html.match(/<img[^>]+src="([^"]+)"/ig);
  if (allImgs) {
    let logoImg = allImgs.find(img => img.toLowerCase().includes('logo'));
    if (logoImg) {
      console.log(logoImg.match(/src="([^"]+)"/i)[1]);
    } else {
      console.log("Not found any logo in imgs");
    }
  }
}
