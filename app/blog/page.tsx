"use client"

import React from 'react'
import GraphemeSplitter from 'grapheme-splitter'
import { TypeAnimation } from 'react-type-animation'

const splitter = new GraphemeSplitter();

function page() {
 
return (
  <div className='flex items-center justify-center h-screen'>
  <TypeAnimation
        splitter={(str) => splitter.splitGraphemes(str)}
        sequence={[
          'COMING SOON...',
          2000,
          '近日公開...',
          2000,
          'قريباً...',
          2000,
          'ਆਨ ਵਾਲੀ...',
          2000,
          '곧 출시됩니다...',
          2000,
          '即將推出...',
          2000
        ]}
        style={{ fontSize: '2em' }}
        repeat={Infinity}
      />
      </div>
);
};
export default page