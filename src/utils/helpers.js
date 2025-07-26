// src/utils/helpers.js
import { clsx } from 'clsx'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export const cn = (...inputs) => {
  return clsx(inputs)
}

export const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'dd MMMM yyyy', { locale: id })
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}