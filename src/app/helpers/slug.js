const slugHandlers = {
  slugafy(text) {
    return (
      text
        .toLowerCase()
        // Convert none standard to -
        .replace(/[^a-z0-9]+/g, '-')
        // Remove conjunctions
        .replace(/(^|-)((the|and|of|to|a|is)(-|$))+/g, '-')
        // Trim -
        .replace(/^[-]+|[-]+$/gm, '')
    )
  },
  handle(model, from, slug) {
    let fromField = from
    let slugField = slug
    if (!slugField) slugField = 'slug'
    if (!fromField) fromField = 'name'

    return function handleSlug(next) {
      const self = this

      if (!self[slugField]) {
        self[slugField] = slugHandlers.slugafy(self[fromField])
      }

      next()
    }
  },
}

module.exports = slugHandlers
