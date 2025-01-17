import { defineStore } from "pinia";
import { markRaw } from "vue";

export const useChartStore = defineStore("chart", {
  state: () => ({
    zoom: 1.0,
    pan: { x: 0, y: 0 },
    ctm: [1, 0, 0, 1, 0, 0],
    inverseCtm: [1, 0, 0, 1, 0, 0],
    tableGroups: {},
    tables: {},
    tablesColors:{},
    refs: {},
    grid: {
      size: 100,
      divisions: 10,
      snap: 5
    },
    loaded: false,
    tooltip: {
      x: 0,
      y: 0,
      show: false,
      target: null,
      component: null,
      binds: null,
      width: 0,
      height: 0
    },
    panel: {
      x: 0,
      y: 0,
      show: false,
      target: null,
      component: null,
      binds: null,
      width: 0,
      height: 0,
      datetime:null
    },
    refspanel: {
      x: 0,
      y: 0,
      show: false,
      target: null,
      component: null,
      binds: null,
      width: 0,
      height: 0,
      datetime:null
    },
  }),
  getters: {
    subGridSize(state) {
      return state.grid.size / state.grid.divisions;
    },
    persistenceData(state) {
      const { zoom, pan, ctm, inverseCtm, tables, refs } = state;
      return  { zoom, pan, ctm, inverseCtm, tables, refs };
    },
    getPan(state) {
      return state.pan;
    },
    getZoom(state) {
      return state.zoom;
    },
    getCTM(state) {
      return state.ctm;
    },
    getTables(){
      return this.tables;
    },
    getRefs(){
      return this.refs;
    },
    getTableGroups(){
      return this.tableGroups;
    },
    getTable(state) {
      return (tableId) => {
        if (!(tableId in state.tables))
          state.tables[tableId] = {
            x: 0,
            y: 0,
            width: 220,
            height: 32
          };
        return state.tables[tableId];
      };
    },
    getTableColor(state) {
      return (tablename, tableId, schema) => {
        let tfn = `${schema}.${tablename}`;
        if (!(tfn in state.tablesColors)) {
          state.tablesColors[tfn] = {
            color:null
        }
        }
        if (tablename in state.tablesColors) {
          state.tablesColors[tfn] = state.tablesColors[tablename];
          delete state.tablesColors[tablename];
        }
        if (tableId in state.tablesColors) {
          state.tablesColors[tfn] = state.tablesColors[tableId];
          delete state.tablesColors[tableId];
        }    

        return state.tablesColors[tfn];
      };
    },
    getTableGroup(state) {
      return (tableGroupId) => {
        if (!(tableGroupId in state.tableGroups))
          state.tableGroups[tableGroupId] = {
            x: 0,
            y: 0,
            width: 200,
            height: 32
          };
        return state.tableGroups[tableGroupId];
      };
    },
    getRef(state) {
      return (refId) => {
        if (!(refId in state.refs))
          state.refs[refId] = {
            endpoints: [],
            vertices: [],
            auto: true
          };
        return state.refs[refId];
      };
    },
    save(state) {
      return {
        zoom: state.zoom,
        pan: state.pan,
        ctm: state.ctm,
        inverseCtm: state.inverseCtm,
        tables: state.tables,
        refs: state.refs,
        tablesColors:state.tablesColors,
        grid: state.grid
      };
    }
  },
  actions: {
    showTooltip(target, component, binds) {
      this.tooltip = {
        x: target.x,
        y: target.y,
        component: markRaw(component),
        binds,
        show: true
      };
    },
    hideTooltip() {
      this.tooltip = {
        x:0,
        y:0,
        width:0,
        height:0,
        component: null,
        binds: null,
        show: false
      };
    },
    showPanel(target, component, binds) {
      this.panel = {
        x: target.x,
        y: target.y,
        component: markRaw(component),
        binds,
        show: true,
        datetime: Date.now()
      };
    },
    showRefPanel(target, component, binds) {
      this.refspanel = {
        x: target.x,
        y: target.y,
        component: markRaw(component),
        binds,
        show: true,
        datetime: Date.now()
      };
    },
    hidePanel() {
      this.panel = {
        x:0,
        y:0,
        width:0,
        height:0,
        component: null,
        binds: null,
        show: false,
        datetime:null
      };
    },
    hideRefPanel() {
      this.refspanel = {
        x:0,
        y:0,
        width:0,
        height:0,
        component: null,
        binds: null,
        show: false,
        datetime:null
      };
    },
    loadDatabase(database) {
      for(const tableGroup of database.schemas[0].tableGroups)
      {
        this.getTableGroup(tableGroup.id);
      }
      for(const table of database.schemas[0].tables)
      {
        this.getTable(table.id);
      }
      for(const ref of database.schemas[0].refs)
      {
        this.getRef(ref.id);
      }
      console.log(database.schemas[0]);
      this.loaded = true;
    },
    load(state) {
      this.$reset();
      this.$patch({
        ...state,
        ctm: DOMMatrix.fromMatrix(state.ctm),
        inverseCtm: DOMMatrix.fromMatrix(state.inverseCtm).inverse()
      });
    },
    updatePan(newPan) {
      this.$patch({
        pan: {
          x: newPan.x,
          y: newPan.y
        }
      });
    },

    updateZoom(newZoom) {
      this.$patch({
        zoom: newZoom
      });
    },

    updateCTM(newCTM) {
      this.$patch({
        ctm: DOMMatrix.fromMatrix(newCTM),
        inverseCtm: DOMMatrix.fromMatrix(newCTM).inverse()
      });
    },
    updateTableColor(tablename,id, color,schema) {
      let tfn = `${schema}.${tablename}`;
      this.$patch({
        tablesColors:{[tfn]: {'color': color }}
      });
    },
    updateTable(tableId, newTable) {
      this.$patch({
        tables:{[tableId]: newTable}
      });
    },
    updateRef(refId, newRef) {
      this.$patch({
        refs:{ [refId]: newRef}
       
      });
    }
  }
});
