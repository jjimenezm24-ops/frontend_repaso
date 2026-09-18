import { useState, useEffect } from 'react';
import type { Vehiculo } from '../api/types/VehiculoTypes';
import {
  getVehiculosActivos,
  crearVehiculo,
  modificarVehiculo,
  anularVehiculo,
} from '../api/services/VehiculoService';

export function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  
  const [placa55, setPlaca55] = useState('');
  const [marca55, setMarca55] = useState('');
  const [modelo55, setModelo55] = useState('');
  const [color55, setColor55] = useState('');
  const [precioDia55, setPrecioDia55] = useState<string>('');
  
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');

  const cargarVehiculos = async () => {
    try {
      const data = await getVehiculosActivos();
      setVehiculos(data);
    } catch (err) {
      setMensaje('❌ Error al obtener la lista de vehículos');
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const limpiarFormulario = () => {
    setPlaca55('');
    setMarca55('');
    setModelo55('');
    setColor55('');
    setPrecioDia55('');
    setIdEditando(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: Vehiculo = {
      ...(idEditando !== null && { idVehiculo: idEditando }),
      placa: placa55,
      marca: marca55,
      modelo: modelo55,
      color: color55,
      precioDia: parseFloat(precioDia55) || 0,
    };

    try {
      if (idEditando === null) {
        const res = await crearVehiculo(payload);
        setMensaje(res.message || '✨ Vehículo registrado con éxito');
      } else {
        const res = await modificarVehiculo(idEditando, payload);
        setMensaje(res.message || '✏️ Vehículo modificado con éxito');
      }
      limpiarFormulario();
      cargarVehiculos();
    } catch (err) {
      setMensaje('❌ Error al procesar la solicitud');
    }
  };

  const prepararEdicion = (v: Vehiculo) => {
    if (v.idVehiculo !== undefined) setIdEditando(v.idVehiculo);
    setPlaca55(v.placa);
    setMarca55(v.marca);
    setModelo55(v.modelo);
    setColor55(v.color);
    setPrecioDia55(v.precioDia.toString());
    setMensaje('');
  };

  const handleAnular = async (id?: number) => {
    if (!id) return;
    if (confirm('¿Desea anular este vehículo?')) {
      try {
        const res = await anularVehiculo(id);
        setMensaje(res.message || '🗑️ Vehículo anulado correctamente');
        cargarVehiculos();
      } catch (err) {
        setMensaje('❌ Error al anular el vehículo');
      }
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        
        <header style={styles.header}>
          <h2 style={styles.studentName}>Estudiante: ELIZABETH MONTEJO</h2>
          <h3 style={styles.studentCard}>Carné: 0904-25-15508</h3>
        </header>

        <h2 style={styles.mainTitle}>✨ Gestión de Vehículos ✨</h2>

        {mensaje && <div style={styles.alert}>{mensaje}</div>}

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            {idEditando ? '✏️ Modificar Vehículo' : '🚗 Registrar Nuevo Vehículo'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Placa</label>
                <input
                  type="text"
                  value={placa55}
                  onChange={(e) => setPlaca55(e.target.value)}
                  style={styles.input}
                  placeholder="Ej. P321JKL"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Marca</label>
                <input
                  type="text"
                  value={marca55}
                  onChange={(e) => setMarca55(e.target.value)}
                  style={styles.input}
                  placeholder="Ej. Kia"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Modelo</label>
                <input
                  type="text"
                  value={modelo55}
                  onChange={(e) => setModelo55(e.target.value)}
                  style={styles.input}
                  placeholder="Ej. Sportage 2020"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Color</label>
                <input
                  type="text"
                  value={color55}
                  onChange={(e) => setColor55(e.target.value)}
                  style={styles.input}
                  placeholder="Ej. Rojo"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Precio por Día (Q)</label>
                <input
                  type="number"
                  step="0.01"
                  value={precioDia55}
                  onChange={(e) => setPrecioDia55(e.target.value)}
                  style={styles.input}
                  placeholder="Ej. 275.00"
                  required
                />
              </div>

              <div style={styles.buttonContainerGrid}>
                <button type="submit" style={styles.primaryBtn}>
                  {idEditando ? 'Actualizar' : 'Guardar'}
                </button>
                {idEditando && (
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    style={styles.cancelBtn}
                  >
                    Cancelar
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📋 Listado de Vehículos Activos</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Placa</th>
                  <th style={styles.th}>Marca</th>
                  <th style={styles.th}>Modelo</th>
                  <th style={styles.th}>Color</th>
                  <th style={styles.th}>Precio/Día</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: '#6b5b95', padding: '24px' }}>
                      No hay vehículos activos registrados.
                    </td>
                  </tr>
                ) : (
                  vehiculos.map((v) => (
                    <tr key={v.idVehiculo} style={styles.tr}>
                      <td style={styles.td}><b>#{v.idVehiculo}</b></td>
                      <td style={styles.td}>{v.placa}</td>
                      <td style={styles.td}>{v.marca}</td>
                      <td style={styles.td}>{v.modelo}</td>
                      <td style={styles.td}>{v.color}</td>
                      <td style={{ ...styles.td, fontWeight: '700', color: '#6c5ce7' }}>
                        Q{Number(v.precioDia || 0).toFixed(2)}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => prepararEdicion(v)}
                          style={styles.editBtn}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleAnular(v.idVehiculo)}
                          style={styles.deleteBtn}
                        >
                          Anular
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageBackground: {
    backgroundColor: '#f3f0f9',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    maxWidth: '920px',
    margin: '0 auto',
  },
  header: {
    background: 'linear-gradient(135deg, #a29bfe 0%, #74b9ff 100%)',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(162, 155, 254, 0.3)',
    textAlign: 'center',
    marginBottom: '28px',
    color: '#ffffff',
  },
  studentName: {
    margin: '0 0 6px 0',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  studentCard: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '500',
    opacity: 0.95,
  },
  mainTitle: {
    textAlign: 'center',
    color: '#4b3869',
    marginBottom: '24px',
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  alert: {
    backgroundColor: '#e8e5ff',
    color: '#4a3e80',
    padding: '16px 20px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '15px',
    marginBottom: '24px',
    border: '1px solid #dcd6ff',
    boxShadow: '0 4px 12px rgba(108, 92, 231, 0.1)',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '28px',
    boxShadow: '0 8px 30px rgba(108, 92, 231, 0.08)',
    border: '1px solid #eae6f5',
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: '22px',
    color: '#4a3e80',
    borderBottom: '2px solid #f0ecfc',
    paddingBottom: '12px',
    fontSize: '20px',
    fontWeight: '700',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: '600',
    color: '#5c4e75',
    fontSize: '14px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #dcd6ff',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: '#fbfaff',
    color: '#2d2d2d',
    transition: 'border-color 0.2s ease',
  },
  buttonContainerGrid: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    boxShadow: '0 4px 14px rgba(108, 92, 231, 0.35)',
    flex: 1,
  },
  cancelBtn: {
    backgroundColor: '#f1f0f7',
    color: '#6c5ce7',
    border: '1px solid #dcd6ff',
    padding: '12px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#6c5ce7',
    color: '#ffffff',
    padding: '16px 14px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '16px 14px',
    borderBottom: '1px solid #f0ecfc',
    fontSize: '14px',
    color: '#4a3e80',
  },
  tr: {
    backgroundColor: '#ffffff',
  },
  editBtn: {
    backgroundColor: '#a29bfe',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(162, 155, 254, 0.4)',
  },
  deleteBtn: {
    backgroundColor: '#ff7675',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(255, 118, 117, 0.3)',
  },
};