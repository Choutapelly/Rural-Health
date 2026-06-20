function readPackage(pkg) {
  // Skip build scripts for sharp since it's optional and causes build warnings
  if (pkg.name === 'sharp') {
    delete pkg.scripts?.build
    delete pkg.scripts?.install
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
