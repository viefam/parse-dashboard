/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
jest.dontMock('../../components/Statistic/Statistic.react');

import React                            from 'react';
import ReactDOM                         from 'react-dom';

const Statistic = require('../../components/Statistic/Statistic.react');

describe('Statistic', () => {
  it('can render examples', () => {
    jest.dontMock('../../components/Statistic/Statistic.example');
    const example = require('../../components/Statistic/Statistic.example');
    example.demos.forEach((example, i) => {
      example.render();
    });
  });
  // test suite goes here
});
