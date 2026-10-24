const { execSync } = require('child_process');

try {
  // Get credential from git credential fill
  const creds = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n' }).toString();
  const tokenMatch = creds.match(/password=(.+)/);
  if (!tokenMatch) {
    console.error('No token found in credential helper');
    process.exit(1);
  }
  const token = tokenMatch[1].trim();

  // Set remote URL with token
  const authUrl = `https://mehruniforyou:${token}@github.com/mehruniforyou/wastram.git`;
  try { execSync('git remote remove origin', { stdio: 'ignore' }); } catch (e) {}
  execSync(`git remote add origin ${authUrl}`);
  
  console.log('Pushing with credential helper disabled so GCM does not hang...');
  // Use -c credential.helper="" and GIT_TERMINAL_PROMPT=0
  const pushOut = execSync('git -c credential.helper="" push -u origin main', {
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    stdio: 'pipe'
  });
  console.log(pushOut.toString());
  
  // Clean up remote URL
  execSync('git remote set-url origin https://github.com/mehruniforyou/wastram.git');
  console.log('Cleaned up remote URL to standard https://github.com/mehruniforyou/wastram.git');
  console.log('PUSH_SUCCESS');
} catch (err) {
  try { execSync('git remote set-url origin https://github.com/mehruniforyou/wastram.git'); } catch(e){}
  console.error('Push error:', err.stderr ? err.stderr.toString() : err.message);
  process.exit(1);
}
