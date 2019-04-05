sed '/pattern to match/d' ./README
echo preview.gif >> .gitignore
echo src/ >> .gitignore
echo release.sh >> .gitignore
npm publish
git checkout .