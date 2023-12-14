import Image from 'next/image'
import { Inter } from 'next/font/google'
import BookingForm from '@/components/BookingForm'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main >
      <h1 className='text-center mt-10 text-2xl text-[#d0475c] font-bold'>Booking Form</h1>
      <BookingForm />
    </main>
  )
}
