/* eslint-disable max-len */
import React from 'react';
import {
  cleanup, render, screen, fireEvent,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Editor from '../components/editor/Editor';
import {
  mockGetlocationSuccess, mockAxiosGetSuccess, sydneyMockWeatherData,
} from './utils/mocks';

afterEach(cleanup);

jest.mock('axios');

// get html fragment for snapshot testing
let asFragment;

beforeEach(async () => {
  mockGetlocationSuccess();
  mockAxiosGetSuccess(sydneyMockWeatherData);

  await act(async () => {
    const renderedEditor = render(<Editor />);
    asFragment = renderedEditor.asFragment;
  });
});

describe('Editor component', () => {
  it('shows uppercase title in widget when typing in text input', async () => {
    const testTitle = 'title';
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: testTitle },
    });
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByTestId('widget-title')).toHaveTextContent(testTitle.toUpperCase());
  });

  it('has celsius and show wind checked in default', () => {
    expect(screen.getByLabelText('On')).toBeChecked();
    expect(screen.getByLabelText(/C$/)).toBeChecked();
  });

  it('convert kelvin to whole number celsius when check celsius', () => {
    const celsiusRadio = screen.getByLabelText(/C$/);
    const fahrenheitRadio = screen.getByLabelText(/F$/);
    fireEvent.click(fahrenheitRadio);
    fireEvent.click(celsiusRadio);

    expect(asFragment()).toMatchSnapshot();
    expect(celsiusRadio).toBeChecked();
    expect(screen.getByTestId('widget-info').querySelector('.widget__temperature')).toHaveTextContent(Math.round(sydneyMockWeatherData.main.temp - 273.15));
  });

  it('convert kelvin to whole number fahrenheit when check fahrenheit', () => {
    const fahrenheitRadio = screen.getByLabelText(/F$/);
    fireEvent.click(fahrenheitRadio);

    expect(asFragment()).toMatchSnapshot();
    expect(fahrenheitRadio).toBeChecked();
    expect(screen.getByTestId('widget-info').querySelector('.widget__temperature')).toHaveTextContent(Math.round((sydneyMockWeatherData.main.temp - 273.15) * 9 / 5 + 32));
  });

  it('should not show wind when wind off is checked', () => {
    const windOffRadio = screen.getByLabelText(/Off/);

    fireEvent.click(windOffRadio);

    expect(asFragment()).toMatchSnapshot();
    expect(windOffRadio).toBeChecked();
    expect(screen.getByTestId('widget-wind').querySelector('.widget__wind-status')).not.toBeInTheDocument();
  });

  it('should show wind when wind off is checked', () => {
    const windOnRadio = screen.getByLabelText(/On/);
    const windOffRadio = screen.getByLabelText(/Off/);
    fireEvent.click(windOffRadio);
    fireEvent.click(windOnRadio);

    expect(asFragment()).toMatchSnapshot();
    expect(windOnRadio).toBeChecked();
    expect(screen.getByTestId('widget-wind').querySelector('.widget__wind-status')).toBeInTheDocument();
  });
});
