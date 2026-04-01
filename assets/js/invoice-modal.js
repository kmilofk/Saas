/**
 * ANTHONY CHEF — INVOICE MODAL
 * Factura simple, limpia y profesional.
 * Estilo documento tradicional — blanco y negro.
 * Uso: FacturaModal.show(venta, session)
 */

const FacturaModal = (() => {

    /* ── Formatters ── */
    const fmt = n => '$' + Number(n).toLocaleString('es-CO');

    const pagoLabel = {
        efectivo:      'Efectivo',
        tarjeta:       'Tarjeta',
        transferencia: 'Transferencia'
    };

    function fmtDate(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString('es-CO', {
            day:   '2-digit',
            month: '2-digit',
            year:  'numeric'
        });
    }

    function fmtTime(iso) {
        const d = new Date(iso);
        return d.toLocaleTimeString('es-CO', {
            hour:   '2-digit',
            minute: '2-digit'
        });
    }

    /* ── Inject overlay + styles (once) ── */
    function _inject() {
        if (document.getElementById('factura-overlay')) return;

        const style = document.createElement('style');
        style.id = 'factura-styles';
        style.textContent = `

        /* ==============================================
           OVERLAY
        ============================================== */
        #factura-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
        }

        /* ==============================================
           RECEIPT WRAPPER  (screen view)
        ============================================== */
        #factura-modal {
            background: #fff;
            color: #000;
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
            line-height: 1.5;
            width: 100%;
            max-width: 400px;
            max-height: 92vh;
            overflow-y: auto;
            border: 1px solid #000;
            display: flex;
            flex-direction: column;
        }

        /* thin scrollbar */
        #factura-modal::-webkit-scrollbar { width: 4px; }
        #factura-modal::-webkit-scrollbar-thumb { background: #888; }

        /* ==============================================
           RECEIPT BODY
        ============================================== */
        .fct-receipt {
            padding: 20px 24px;
            flex: 1;
        }

        /* Header */
        .fct-company {
            text-align: center;
            margin-bottom: 12px;
            line-height: 1.6;
        }
        .fct-company .company-name {
            font-size: 15px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .fct-company .company-meta {
            font-size: 12px;
        }

        /* Separator */
        .fct-sep {
            border: none;
            border-top: 1px dashed #000;
            margin: 10px 0;
        }
        .fct-sep-solid {
            border: none;
            border-top: 1px solid #000;
            margin: 10px 0;
        }

        /* Sale info block */
        .fct-info {
            margin-bottom: 4px;
        }
        .fct-info-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding: 1px 0;
        }
        .fct-info-row .i-label {
            color: #000;
        }
        .fct-info-row .i-value {
            text-align: right;
        }

        /* Section heading */
        .fct-section-heading {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin: 10px 0 4px;
        }

        /* Products table */
        .fct-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        .fct-table thead tr {
            border-bottom: 1px solid #000;
        }
        .fct-table thead th {
            padding: 3px 4px;
            font-weight: bold;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
        }
        .fct-table thead th.r { text-align: right; }
        .fct-table tbody td {
            padding: 3px 4px;
            vertical-align: top;
        }
        .fct-table tbody td.r { text-align: right; }
        .fct-table tbody td.c { text-align: center; }
        .fct-table tbody tr:last-child td {
            padding-bottom: 6px;
        }

        /* Totals block */
        .fct-totals {
            font-size: 12px;
        }
        .fct-totals-row {
            display: flex;
            justify-content: space-between;
            padding: 2px 0;
        }
        .fct-totals-row.total-final {
            font-weight: bold;
            font-size: 14px;
            border-top: 1px solid #000;
            margin-top: 4px;
            padding-top: 5px;
        }

        /* Footer */
        .fct-footer {
            text-align: center;
            font-size: 12px;
            margin-top: 12px;
            line-height: 1.7;
        }

        /* ==============================================
           ACTION BUTTONS  (screen only)
        ============================================== */
        .fct-actions {
            display: flex;
            gap: 12px;
            padding: 16px 24px 20px;
            background: #fff;
            flex-shrink: 0;
            border-top: 1px solid #eee;
        }
        .fct-btn {
            flex: 1;
            padding: 10px 14px;
            border: none;
            border-radius: 8px;
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        .fct-btn i { font-size: 14px; }

        .btn-print {
            background: #0B132B;
            color: #fff;
        }
        .btn-print:hover {
            background: #1A2847;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(11,19,43,0.15);
        }

        .btn-close {
            background: #F1F5F9;
            color: #475569;
        }
        .btn-close:hover {
            background: #E2E8F0;
            color: #1E293B;
        }
        .fct-btn:active { transform: scale(0.98); }

        /* ==============================================
           PRINT  — receipt only, no UI chrome
        ============================================== */
        @media print {
            body > *:not(#factura-overlay) { display: none !important; }

            #factura-overlay {
                position: static !important;
                background: none !important;
                display: block !important;
                padding: 0 !important;
            }
            #factura-modal {
                max-height: none !important;
                overflow: visible !important;
                box-shadow: none !important;
                border: none !important;
                width: 100% !important;
                max-width: 100% !important;
            }
            .fct-actions { display: none !important; }

            @page {
                margin: 12mm 10mm;
                size: A4;
            }
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'factura-overlay';
        overlay.style.display = 'none';
        overlay.innerHTML = `
            <div id="factura-modal" role="dialog" aria-modal="true" aria-label="Factura de venta"></div>
        `;
        document.body.appendChild(overlay);

        /* Close on overlay click */
        overlay.addEventListener('click', e => {
            if (e.target === overlay) close();
        });

        /* Close on Escape */
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && overlay.style.display !== 'none') close();
        });
    }

    /* ── Build receipt HTML ── */
    function _buildHTML(venta, session) {
        const subtotal = venta.items.reduce((s, i) => s + i.subtotal, 0);

        /* Products rows */
        const rowsHTML = venta.items.map(i => `
            <tr>
                <td>${i.nombre}</td>
                <td class="c">${i.cantidad}</td>
                <td class="r">${fmt(i.precio)}</td>
                <td class="r">${fmt(i.subtotal)}</td>
            </tr>
        `).join('');

        return `
        <div class="fct-receipt">

            <!-- ── HEADER ── -->
            <div class="fct-company">
                <div class="company-name">${(session.nombre || 'Anthony Chef').toUpperCase()}</div>
                ${session.direccion ? `<div class="company-meta">${session.direccion}</div>` : ''}
                ${session.telefono  ? `<div class="company-meta">Tel: ${session.telefono}</div>` : ''}
            </div>

            <hr class="fct-sep-solid">

            <!-- ── SALE INFO ── -->
            <div class="fct-info">
                <div class="fct-info-row">
                    <span class="i-label">Factura N°</span>
                    <span class="i-value">${venta.id}</span>
                </div>
                <div class="fct-info-row">
                    <span class="i-label">Fecha</span>
                    <span class="i-value">${fmtDate(venta.fecha)}</span>
                </div>
                <div class="fct-info-row">
                    <span class="i-label">Hora</span>
                    <span class="i-value">${fmtTime(venta.fecha)}</span>
                </div>
                <div class="fct-info-row">
                    <span class="i-label">Cajero</span>
                    <span class="i-value">${session.encargado || '—'}</span>
                </div>
                <div class="fct-info-row">
                    <span class="i-label">Pago</span>
                    <span class="i-value">${pagoLabel[venta.metodoPago] || venta.metodoPago}</span>
                </div>
            </div>

            <hr class="fct-sep">

            <!-- ── PRODUCTS ── -->
            <div class="fct-section-heading">Detalle</div>
            <table class="fct-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th class="r">Cant</th>
                        <th class="r">Precio</th>
                        <th class="r">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML}
                </tbody>
            </table>

            <hr class="fct-sep">

            <!-- ── TOTALS ── -->
            <div class="fct-totals">
                <div class="fct-totals-row">
                    <span>Subtotal</span>
                    <span>${fmt(subtotal)}</span>
                </div>
                <div class="fct-totals-row total-final">
                    <span>TOTAL</span>
                    <span>${fmt(venta.total)}</span>
                </div>
            </div>

            <hr class="fct-sep">

            <!-- ── FOOTER ── -->
            <div class="fct-footer">
                Gracias por su compra<br>
                <small>Conserve este recibo como comprobante</small>
            </div>

        </div>

        <!-- ── ACTIONS (screen only) ── -->
        <div class="fct-actions">
            <button class="fct-btn btn-print" onclick="FacturaModal.print()">
                <i class="fas fa-print"></i> Imprimir Factura
            </button>
            <button class="fct-btn btn-close" onclick="FacturaModal.close()">
                <i class="fas fa-times"></i> Cerrar
            </button>
        </div>
        `;
    }

    /* ── Public API ── */
    function show(venta, session) {
        _inject();
        const overlay = document.getElementById('factura-overlay');
        const modal   = document.getElementById('factura-modal');
        modal.innerHTML = _buildHTML(venta, session);
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        modal.scrollTop = 0;
    }

    function close() {
        const overlay = document.getElementById('factura-overlay');
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    function print() {
        window.print();
    }

    return { show, close, print };

})();
