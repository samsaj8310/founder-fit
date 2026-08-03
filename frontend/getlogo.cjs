const fs = require('fs');
const html = fs.readFileSync('infopace.html', 'utf8');
const match1 = html.match(/src="([^"]*wp-content\/uploads[^"]*(?:logo|infopace)[^"]*\.(?:png|svg|jpg))"/i);
if (match1) console.log(match1[1]);
else {
  const match2 = html.match(/src="([^"]*\.png)"/ig);
  if (match2) {
    const logo = match2.find(s => s.toLowerCase().includes('logo'));
    console.log(logo || match2.slice(0, 3).join('\n'));
  } else {
    console.log('No logo match');
  }
}
