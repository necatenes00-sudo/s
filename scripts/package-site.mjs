import { cpSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
if (!existsSync('out/index.html')) throw new Error('Run npm run build first.');
if (process.argv.includes('--pages')) {
  cpSync('out', 'docs', { recursive: true });
  writeFileSync('docs/.nojekyll', '');
} else {
  mkdirSync('downloads', { recursive: true });
  const result = spawnSync('python3', ['-c', `import pathlib, zipfile
with zipfile.ZipFile('downloads/demir-digital-site.zip','w',zipfile.ZIP_DEFLATED) as archive:
 for file in pathlib.Path('out').rglob('*'):
  if file.is_file(): archive.write(file,file.relative_to('out'))
 archive.writestr('KURULUM.txt','Bu çok sayfalı site bir web sunucusunda çalışır. ZIP içeriğini hosting public_html klasörüne yükleyin. Yerel önizleme: python3 -m http.server 8080 ve http://localhost:8080 adresini açın. Dosyayı çift tıklamak Next.js sayfa geçişlerini desteklemez. İletişim formu email uygulamasını açar; otomatik gönderim yapmaz.')
`], { stdio: 'inherit' });
  if (result.status) process.exit(result.status);
}
console.log(process.argv.includes('--pages') ? 'GitHub Pages: docs/' : 'Deployment ZIP: downloads/demir-digital-site.zip');
