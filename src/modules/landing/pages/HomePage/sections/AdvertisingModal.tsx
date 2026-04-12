import { useEffect, useState } from 'react'
import { publicApiClient } from '../../../../../config/public-api.client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

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

  const LinkIcon = () => (
    <svg
      className="h-6 w-6 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )

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
            className="group relative w-full overflow-hidden rounded-xl"
          >
            <img
              src={items[0].imageUrl}
              alt=""
              className="h-[420px] w-full object-cover"
            />
            {items[0].isRedirectEnabled && items[0].targetUrl ? (
              <span className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="rounded-full bg-black/45 p-2.5">
                  <LinkIcon />
                </span>
              </span>
            ) : null}
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
                  className="group relative w-full overflow-hidden rounded-xl"
                >
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-[420px] w-full object-cover"
                  />
                  {item.isRedirectEnabled && item.targetUrl ? (
                    <span className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="rounded-full bg-black/45 p-2.5">
                        <LinkIcon />
                      </span>
                    </span>
                  ) : null}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  )
}
