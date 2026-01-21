
function renderizarCheckboxesVinculo() {
    const container = document.getElementById("checkboxContainer");
    const selectAll = document.getElementById("selectAll");

    container.innerHTML = "";
    selectAll.checked = false;

    const equipesVinculadasIds = vinculosEvento.map(v => v.equipe.id);

    equipesTodas.forEach(eq => {
        const checked = equipesVinculadasIds.includes(eq.id) ? "checked" : "";

        container.innerHTML += `
            <label class="checkbox-item">
                <input
                    type="checkbox"
                    value="${eq.id}"
                    ${checked}
                    onchange="syncSelectAll()"
                >
                <span>${eq.nome}</span>
            </label>
        `;
    });
    syncSelectAll();
}

function syncSelectAll() {
    const checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    document.getElementById("selectAll").checked = allChecked;
}

function toggleSelectAll(master) {
    const checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]');

    checkboxes.forEach(cb => {
        const equipeId = cb.value;

        if (master.checked) {
            // Marcar todos
            cb.checked = true;
        } else {
            //  Desmarcar apenas os que NÃO eram originais
            if (!equipesVinculadasOriginais.includes(equipeId)) {
                cb.checked = false;
            }
        }
    });
    syncSelectAll();
}

async function carregarDadosVinculoEquipe() {
    const [equipesRes, vinculosRes] = await Promise.all([
        fetch(`${APP_CONFIG.API_BASE_URL}/equipes`, {
            headers: { Authorization: "Bearer " + token }
        }),
        fetch(`${APP_CONFIG.API_BASE_URL}/equipes-evento/evento/${eventoId}`, {
            headers: { Authorization: "Bearer " + token }
        })
    ]);

    equipesTodas = (await equipesRes.json()).data || [];
    vinculosEvento = (await vinculosRes.json()).data || [];

    // snapshot do estado inicial
    equipesVinculadasOriginais = vinculosEvento.map(v => v.equipe.id);

    renderizarCheckboxesVinculo();
}
async function carregarSelects() {
    const [cadastrosRes, equipesRes] = await Promise.all([
        fetch(`${APP_CONFIG.API_BASE_URL}/cadastro`, { headers: { Authorization: "Bearer " + token } }),
        fetch(`${APP_CONFIG.API_BASE_URL}/equipes-evento/evento/${eventoId}`, { headers: { Authorization: "Bearer " + token } })
    ]);

    const cadastros = (await cadastrosRes.json()).data || [];
    const equipes = (await equipesRes.json()).data || [];

    const cadastroSelect = document.getElementById("cadastro_id");
    const equipeSelect = document.getElementById("equipe_id");


    cadastroSelect.innerHTML = `<option value="">Selecione</option>`;
    equipeSelect.innerHTML = `<option value="">Selecione</option>`;

    cadastros.forEach(c => {
        cadastroSelect.innerHTML += `<option value="${c.id}">${c.nome_completo_esposo} e ${c.nome_completo_esposa}</option>`;
    });

    equipes.forEach(e => {
        equipeSelect.innerHTML += `<option value="${e.equipe.id}">${e.equipe.nome}</option>`;
    });
}