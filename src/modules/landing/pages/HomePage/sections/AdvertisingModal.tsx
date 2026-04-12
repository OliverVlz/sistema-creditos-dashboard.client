import { useEffect, useState } from 'react'
import { publicApiClient } from '../../../../../config/public-api.client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

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
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({})

  useEffect(() => {
    const load = async () => {
      const response = await publicApiClient.get('/advertisements/public/landing')
      setItems(response.data || [])
      setActiveIndex(0)
    }
    load()
  }, [])

  useEffect(() => {
    if (!items.length) {
      return
    }

    items.forEach((item) => {
      if (imageRatios[item.id]) {
        return
      }

      const image = new window.Image()
      image.onload = () => {
        if (!image.width || !image.height) {
          return
        }
        setImageRatios((prev) => ({
          ...prev,
          [item.id]: image.width / image.height,
        }))
      }
      image.src = item.imageUrl
    })
  }, [items, imageRatios])

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

  const activeItem = items[activeIndex] || items[0]
  const activeRatio = imageRatios[activeItem.id] || 16 / 9
  const frameStyle = {
    width: `min(92vw, calc(78vh * ${activeRatio}))`,
    height: `min(78vh, calc(92vw / ${activeRatio}))`,
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-fit max-w-[95vw] rounded-2xl bg-white p-3 shadow-2xl">
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
            className="group relative overflow-hidden rounded-xl"
            style={frameStyle}
          >
            <img
              src={items[0].imageUrl}
              alt=""
              className="h-full w-full rounded-xl bg-black object-contain"
            />
            {items[0].isRedirectEnabled && items[0].targetUrl ? (
              <span className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="rounded-full bg-black/45 p-2.5">
                  <LinkIcon />
                </span>
              </span>
            ) : null}
          </button>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            loop
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="rounded-xl [&_.swiper-pagination-bullet-active]:!bg-brand-500 [&_.swiper-button-next:after]:text-3xl [&_.swiper-button-prev:after]:text-3xl"
            style={{
              ...frameStyle,
              ['--swiper-navigation-color' as string]: '#f07f44',
            }}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <button
                  type="button"
                  onClick={() => handleClick(item)}
                  className="group relative h-full w-full overflow-hidden rounded-xl"
                >
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-full w-full rounded-xl bg-black object-contain"
                  />
                  {item.isRedirectEnabled && item.targetUrl ? (
                    <span className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
