import React from 'react'
import {FadeLoader} from 'react-spinners'

const Loader = () => {
  return (
    <div className=''>
        <FadeLoader
          color="#36d7b7"
          loading={true}
          cssOverride={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'red',
          }}
          //@ts-ignore
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
    </div>
  )
}

export default Loader