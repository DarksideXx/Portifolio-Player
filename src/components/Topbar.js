/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'

const Topbar = () => (
  <div
    className="Topbar"
    css={css`
      position: absolute;
      top: 0;
      height: 50px;
      background: #070707;
      left: 200px;
      width: calc(100% - 200px);
      padding: 20px;
    `}
  ></div>
)

export default Topbar
