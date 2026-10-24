const { execSync } = require('child_process');

const creds = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n' }).toString();
const token = creds.match(/password=(.+)/)[1].trim();
const authHeader = 'AUTHORIZATION: basic ' + Buffer.from('x-access-token:' + token).toString('base64');

try {
  console.log('Testing git ls-remote with extraheader...');
  const out = execSync(`git -c "http.extraheader=${authHeader}" ls-remote https://github.com/mehruniforyou/wastram.git`);
  console.log('LS_REMOTE_SUCCESS:');
  console.log(out.toString());
} catch(e) {
  console.error('FAILED:', e.stderr ? e.stderr.toString() : e.message);
}
