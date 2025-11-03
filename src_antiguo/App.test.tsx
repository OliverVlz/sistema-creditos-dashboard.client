import { render } from '@test/test-wrapper';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Test básico para verificar que la app se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });
});
