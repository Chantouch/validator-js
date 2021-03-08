export function leapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function checkFalsePositiveDates(dateString: string): boolean {
  if (dateString.length === 10) {
    // massage input to use yyyy-mm-dd format
    // we support yyyy/mm/dd or yyyy.mm.dd
    const normalizedDate = dateString.replace('.', '-').replace('/', '-')
    const parts = normalizedDate.split('-')
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // yyyy-mm-dd format
        const y = parseInt(parts[0])
        const m = parseInt(parts[1])
        const d = parseInt(parts[2])
        if (m === 2) {
          // return leapYear(y) ? d <= 29 : d <= 28;
          if (leapYear(y)) {
            if (d > 29) {
              return false
            }
          } else {
            if (d > 28) {
              return false
            }
          }
        }
        if (m === 4 || m === 6 || m === 9 || m === 11) {
          if (d > 30) {
            return false
          }
        }
      }
    }
    return true
  }
  return true
}

export function isValidDate(dateString: string | any): boolean {
  let testDate
  if (typeof dateString === 'number') {
    testDate = new Date(dateString)
    if (typeof testDate === 'object') {
      return true
    }
  }
  // first convert incoming string to date object and see if it correct date and format
  testDate = new Date(dateString)
  if (typeof testDate === 'object') {
    if (testDate.toString() === 'Invalid Date') {
      return false
    }

    /**
     * Check for false positive dates
     * perform special check on february as JS `new Date` incorrectly returns valid date
     * Eg.  let newDate = new Date('2020-02-29')  // returns as March 02 2020
     * Eg.  let newDate = new Date('2019-02-29')  // returns as March 01 2020
     * Eg.  let newDate = new Date('2019-04-31')  // returns as April 30 2020
     */
    if (!checkFalsePositiveDates(dateString)) {
      return false
    }

    // valid date object and not a february date
    return true
  }

  // First check for the pattern
  const regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/

  if (!regex_date.test(dateString)) {
    return false
  }

  // Parse the date parts to integers
  const parts = dateString.split('-')
  const day = parseInt(parts[2], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[0], 10)

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month == 0 || month > 12) {
    return false
  }

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    monthLength[1] = 29
  }

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1]
}
