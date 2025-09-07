// tools/combine_ics.js
// Merge multiple ICS feeds into one combined file.
// Usage: node tools/combine_ics.js "assets/Tango Local.ics" "assets/Tango Regional.ics" > assets/events_combined.ics
const fs = require('fs');

function extract(text){
  const re = /BEGIN:VEVENT[\s\S]*?END:VEVENT\s*/g;
  return text.match(re) || [];
}
const inputs = process.argv.slice(2);
let blocks = [];
for (const f of inputs){
  if (fs.existsSync(f)){
    const t = fs.readFileSync(f, 'utf8');
    blocks = blocks.concat(extract(t));
  }
}
const now = new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+Z$/,'Z');
const header = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tango Analogico//Combined Local+Regional//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Tango Analogico – Local + Regional
X-WR-TIMEZONE:America/Denver
DTSTAMP:${now}
`;
process.stdout.write(header + blocks.join('') + "END:VCALENDAR\\n");
