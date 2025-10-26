'use client'

import React from 'react'

const SpacesImage = () => {

  const file = 'https://al-sharq.fra1.digitaloceanspaces.com/page.png.jpg'

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>Image from DigitalOcean Spaces</h2>
      <img
        src={file}
        alt="Spaces image"
        style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
      />
    </div>
  )
}

export default SpacesImage
