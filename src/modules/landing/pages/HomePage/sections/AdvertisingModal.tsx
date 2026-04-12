import { useEffect, useState } from 'react'
import { publicApiClient } from '../../../../../config/public-api.client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

interface PublicAdvertisement {
  id: string
  title: string
  imageUrl: string
  targetUrl?: string
  isRedirectEnabled: boolean
}

export default function AdvertisingModal() {
  const [items, setItems] = useState<PublicAdvertisement[]>([])
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const load = async () => {
      const response = await publicApiClient.get('/advertisements/public/landing')
      setItems(response.data || [])
    }
    load()
  }, [])

  const handleClick = (item: PublicAdvertisement) => {
    if (!item.isRedirectEnabled || !item.targetUrl) {
      return
    }
    window.open(item.targetUrl, '_blank', 'noopener,noreferrer')
  }

  if (!open || !items.length) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-3 shadow-2xl">
        <button
          type="button"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-2 py-1 text-white"
          onClick={() => setOpen(false)}
        >
          <i className="pi pi-times" />
        </button>

        {items.length === 1 ? (
          <button
            type="button"
            onClick={() => handleClick(items[0])}
            className="w-full overflow-hidden rounded-xl"
          >
            <img
              src={items[0].imageUrl}
              alt={items[0].title}
              className="h-[420px] w-full object-cover"
            />
          </button>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="rounded-xl"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <button
                  type="button"
                  onClick={() => handleClick(item)}
                  className="w-full overflow-hidden rounded-xl"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-[420px] w-full object-cover"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  )
}
