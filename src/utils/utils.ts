import userSvg from 'src/assets/images/user.svg'

export const rateSale = (orginal: number, pricePresent: number) =>
  Math.floor(((orginal - pricePresent) / orginal) * 100)

//Xoá các ký tự đặt biệt trên bàn phím
const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i.${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i.')
  return arr[arr.length - 1]
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export const getAvatarUrl = (avatarName?: string) =>
  avatarName ? `https://api-ecom.duthanhduoc.com/images/${avatarName}` : userSvg
