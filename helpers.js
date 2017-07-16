module.exports = {
  get_absolute_path (path) {
    if (!path) return process.cwd()
    if (path[0] != '/' && path[0] != '~')
      return `${process.cwd()}/${path}`
    return path
  }
}