export default function ImageComponent() {
  return (
    <div style={{ width: '650px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
<div style={{ fontWeight: 400, fontSize: '30px', color: '#282828', textAlign: 'center', marginBottom: '20px' }}>
  Connecting Minds
  <br />
  <b>
    <strong>Shaping </strong>
    <strong style={{ color: '#9B2033' }}> Futures</strong>
  </b>
</div>

      <div style={{ position: 'relative', width: '520px', height: '420px' }}>
        <div style={{ position: 'absolute', width: '210px', height: '150px', left: '0px', top: '0px', backgroundImage: 'url(/images/img3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px' }}></div>
        <div style={{ position: 'absolute', width: '290px', height: '310px', left: '230px', top: '0px', backgroundImage: 'url(/images/img2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '14px' }}></div>
        <div style={{ position: 'absolute', width: '270px', height: '200px', left: '0px', top: '160px', backgroundImage: 'url(/images/img1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', border: '4px solid #FFFFFF', borderRadius: '14px', boxSizing: 'border-box' }}></div>
      </div>
    </div>
  )
}
