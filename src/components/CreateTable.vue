<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="库名">
        <el-input v-model="form.databaseName" placeholder="请输入库名（可选）"></el-input>
      </el-form-item>

      <el-form-item label="表名">
        <el-input v-model="form.tableName" placeholder="请输入表名"></el-input>
      </el-form-item>

      <el-form-item label="表注释">
        <el-input  v-model="form.tableComment" placeholder="请输入表注释"></el-input>
      </el-form-item>

      <el-table :data="form.columns" style="width: 100%">
        <el-table-column prop="name" label="列名" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="列名"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="数据类型" width="250">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="选择数据类型" @change="handleTypeChange(scope.row)">
              <el-option label="TINYINT" value="TINYINT"></el-option>
              <el-option label="SMALLINT" value="SMALLINT"></el-option>
              <el-option label="INT" value="INT"></el-option>
              <el-option label="BIGINT" value="BIGINT"></el-option>
              <el-option label="LARGEINT" value="LARGEINT"></el-option>
              <el-option label="FLOAT" value="FLOAT"></el-option>
              <el-option label="DOUBLE" value="DOUBLE"></el-option>
              <el-option label="DECIMAL" value="DECIMAL"></el-option>
              <el-option label="DATE" value="DATE"></el-option>
              <el-option label="DATETIME" value="DATETIME"></el-option>
              <el-option label="CHAR" value="CHAR"></el-option>
              <el-option label="VARCHAR" value="VARCHAR"></el-option>
              <el-option label="HLL" value="HLL"></el-option>
              <el-option label="BITMAP" value="BITMAP"></el-option>
            </el-select>
            <template v-if="scope.row.type === 'DECIMAL'">
              <el-input v-model.number="scope.row.precision" placeholder="precision" type="number" style="width: 100px; display: inline-block; margin-left: 10px;"></el-input>
              <el-input v-model.number="scope.row.scale" placeholder="scale" type="number" style="width: 100px; display: inline-block; margin-left: 10px;"></el-input>
            </template>
            <template v-if="scope.row.type === 'CHAR' || scope.row.type === 'VARCHAR'">
              <el-input v-model.number="scope.row.length" placeholder="length" type="number" style="width: 100px; display: inline-block; margin-left: 10px;"></el-input>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="key" label="KEY" width="100">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.key"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="aggrType" label="聚合类型" width="250">
          <template slot-scope="scope">
            <el-select v-model="scope.row.aggrType" :disabled="shouldDisableAggrType(scope.row)" placeholder="选择聚合类型">
              <el-option label="SUM" value="SUM"></el-option>
              <el-option label="MIN" value="MIN"></el-option>
              <el-option label="MAX" value="MAX"></el-option>
              <el-option label="REPLACE" value="REPLACE"></el-option>
              <el-option label="REPLACE_IF_NOT_NULL" value="REPLACE_IF_NOT_NULL"></el-option>
              <el-option label="HLL_UNION" value="HLL_UNION"></el-option>
              <el-option label="BITMAP_UNION" value="BITMAP_UNION"></el-option>
            </el-select>
          </template>
        </el-table-column>

        
        <el-table-column prop="nullable" label="NOT NULL" width="100">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.nullable"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="defaultValue" label="默认值" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.defaultValue" placeholder="默认值"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="注释" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.comment" placeholder="注释"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="removeColumn(scope.$index)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item>
        <el-button type="primary" @click="addColumn">添加列</el-button>
      </el-form-item>

      <el-form-item label="数据模型">
        <el-select v-model="form.keysType" placeholder="选择数据模型">
          <el-option label="DUPLICATE KEY" value="DUPLICATE KEY"></el-option>
          <el-option label="AGGREGATE KEY" value="AGGREGATE KEY"></el-option>
          <el-option label="UNIQUE KEY" value="UNIQUE KEY"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分布方式">
        <el-select v-model="form.distributionType" placeholder="选择分布方式" @change="handleDistributionChange">
          <el-option label="HASH" value="HASH"></el-option>
          <el-option label="RANDOM" value="RANDOM"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.distributionType === 'HASH'" label="哈希分桶">
        <el-select v-model="form.hashKeys" multiple filterable allow-create default-first-option placeholder="选择分桶列">
          <el-option v-for="column in form.columns" :key="column.name" :label="column.name" :value="column.name">
          </el-option>
        </el-select>
        <el-input v-model="form.buckets" placeholder="BUCKETS num || 'auto'" style="width: 200px; margin-top: 10px;"></el-input>
      </el-form-item>

      <el-form-item v-if="form.distributionType === 'RANDOM'" label="随机分桶">
        <el-input v-model="form.buckets" placeholder="BUCKETS num || 'auto'" type="text" style="width: 200px;"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="generateSQL">生成 SQL</el-button>
      </el-form-item>

      <el-form-item label="生成的 SQL">
        <el-input type="textarea" v-model="generatedSQL" readonly > </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>



<script>
export default {
  data() {
    return {
      form: {
        databaseName: '',
        tableName: '',
        columns: [],
        keysType: 'DUPLICATE KEY',
        distributionType: '',
        hashKeys: [],
        buckets: '',
        engineType: '',
        tableComment: '',
        partitionInfo: '',
        properties: '',
        extraProperties: ''
      },
      generatedSQL: ''
    };
  },
  computed: {
    isAggregateKey() {
      return this.form.keysType === 'AGGREGATE KEY';
    }
  },
  methods: {
    shouldDisableAggrType(row) {
      // 禁用聚合类型选择器并清空聚合类型如果数据模型是 DUPLICATE KEY 或 UNIQUE KEY
      if (this.form.keysType === 'DUPLICATE KEY' || this.form.keysType === 'UNIQUE KEY') {
        row.aggrType = ''; // 清空聚合类型
        return true; // 禁用选择器
      }
      // 对于 AGGREGATE KEY，仅当列被标为 key 时禁用
      if (this.form.keysType === 'AGGREGATE KEY' && row.key) {
        row.aggrType = ''; // 清空聚合类型
        return true;
      }
      return false;
    },
    addColumn() {
      this.form.columns.push({
        name: '',
        type: '',
        key: false,
        aggrType: '',
        notNullable: false,
        defaultValue: '',
        comment: ''
      });
    },
    removeColumn(index) {
      this.form.columns.splice(index, 1);
    },
    handleTypeChange(row) {
      if (row.type === 'HLL' || row.type === 'BITMAP') {
        row.defaultValue = '';
        row.aggrType = '';
      }
    },
    handleDistributionChange() {
      if (this.form.distributionType !== 'HASH') {
        this.form.hashKeys = [];
      }
    },
    // 美化 SQL 语句
    beautifySQL(sql) {
      const keywords = [
        'CREATE TABLE', 'IF NOT EXISTS', 'ENGINE', 'COMMENT', 'PARTITION BY',
        'DISTRIBUTED BY', 'HASH', 'BUCKETS', 'RANDOM', 'PROPERTIES'
      ];
      let formattedSQL = sql;

      // 确保所有关键字大写
      keywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        formattedSQL = formattedSQL.replace(regex, keyword);
      });

      // 添加换行和缩进
      formattedSQL = formattedSQL.replace(/, /g, ',\n  ');
      formattedSQL = formattedSQL.replace(/\) ENGINE/g, ')\nENGINE');
      formattedSQL = formattedSQL.replace(/\) COMMENT/g, ')\nCOMMENT');
      formattedSQL = formattedSQL.replace(/PARTITION BY/g, '\nPARTITION BY');
      formattedSQL = formattedSQL.replace(/DISTRIBUTED BY/g, 'DISTRIBUTED BY');
      formattedSQL = formattedSQL.replace(/PROPERTIES \(/g, '\nPROPERTIES (\n  ');
      formattedSQL = formattedSQL.replace(/\) BUCKETS/g, ')BUCKETS');

      return formattedSQL;
    },
    generateSQL() {
      if (!this.form.tableName || this.form.columns.length === 0) {
        this.$message.error('请填写表名并添加至少一列');
        return;
      }

      for (let column of this.form.columns) {
        if (!column.name || !column.type) {
          this.$message.error('每个列必须填写列名和数据类型');
          return;
        }
      }
      if (['DUPLICATE KEY', 'UNIQUE KEY' ,'AGGREGATE KEY'].includes(this.form.keysType)) {
        // 确保至少有一个 key 被选中
        const hasKey = this.form.columns.some(column => column.key);
        if (!hasKey) {
          this.$message.error('至少要有一个字段被选为 key');
          return;
        }
      }


      let tableName = this.form.databaseName 
        ? `${this.form.databaseName}.${this.form.tableName}` 
        : this.form.tableName;
      let ifNotExists = 'IF NOT EXISTS ';

      let columnsSQL = this.form.columns.map(column => {
        let colDetails = `${column.name} ${column.type}`;
        if (column.type === 'DECIMAL') {
          colDetails += `(${column.precision}, ${column.scale})`;
        }
        if ((column.type === 'CHAR' || column.type === 'VARCHAR') && column.length) {
          colDetails += `(${column.length})`;
        }
        if (column.nullable) colDetails += ' NOT NULL';
        if (column.defaultValue) colDetails += ` DEFAULT '${column.defaultValue}'`;
        if (column.comment) colDetails += ` COMMENT '${column.comment}'`;
        if (this.isAggregateKey && !column.key && !column.aggrType) {
          this.$message.error('非 key 字段必须选择聚合类型');
          throw new Error('Non-key fields must have an aggregation type selected');
        }
        if (column.aggrType) colDetails += ` ${column.aggrType}`; // 添加聚合类型
        return colDetails;
      }).join(', ');

      let keyColumns = this.form.columns.filter(col => col.key).map(col => col.name).join(', ');
      let keysSQL = keyColumns ? `${this.form.keysType}(${keyColumns})` : '';

      // let keysSQL = this.form.keysType ? `${this.form.keysType} (${this.form.columns.filter(col => col.key).map(col => col.name).join(', ')})` : '';

      let distributionSQL = '';


      if (!this.form.distributionType ){
        this.$message.error('请添加分桶方式');
          return;
        } else if(this.form.distributionType === 'HASH') {  

          console.log(this.form.hashKeys);

          if (this.form.hashKeys.length === 0) {
            this.$message.error('请添加分桶列');
          return;
          } else {
            distributionSQL = `DISTRIBUTED BY HASH(${this.form.hashKeys.join(', ')})`;
          }
        
        if (this.form.buckets) {
          distributionSQL += ` BUCKETS ${this.form.buckets}`;
        }
      } else if(this.form.distributionType === 'RANDOM') {
        distributionSQL = `DISTRIBUTED BY RANDOM`;
        if (this.form.buckets) {
          distributionSQL += ` BUCKETS ${this.form.buckets}`;
        }
      }

      // if (!this.form.distributionType ){
      //   this.$message.error('请添加分桶方式');
      //     return;
      //   } else if(this.form.distributionType === 'HASH') {  
      //   distributionSQL = `DISTRIBUTED BY HASH(${this.form.hashKeys.join(', ')})`;
      //   if (!this.form.buckets) {
      //     distributionSQL += ` BUCKETS ${this.form.buckets}`;
      //   }
      // } else if(this.form.distributionType === 'RANDOM') {
      //   distributionSQL = `DISTRIBUTED BY RANDOM`;
      //   if (this.form.buckets) {
      //     distributionSQL += ` BUCKETS ${this.form.buckets}`;
      //   }
      // }

      let engineSQL = this.form.engineType ? `ENGINE = ${this.form.engineType}` : '';
      let commentSQL = this.form.tableComment ? `COMMENT '${this.form.tableComment}'` : '';
      let partitionSQL = this.form.partitionInfo ? `PARTITION BY ${this.form.partitionInfo}` : '';
      let propertiesSQL = this.form.properties ? `${this.form.properties}` : '';
      let extraPropertiesSQL = this.form.extraProperties ? `${this.form.extraProperties}` : '';

      // 使用生成的 SQL
      let rawSQL = `CREATE TABLE ${ifNotExists}${tableName} (\n  ${columnsSQL}\n)${keysSQL ? `\n${keysSQL}` : ''}${engineSQL ? `\n${engineSQL}` : ''}${commentSQL ? `\n${commentSQL}` : ''}${partitionSQL ? `\n${partitionSQL}` : ''}${distributionSQL ? `\n${distributionSQL}` : ''}${propertiesSQL ? `\nPROPERTIES (${propertiesSQL})` : ''}${extraPropertiesSQL ? `\n${extraPropertiesSQL}` : ''};`;
      this.generatedSQL = this.beautifySQL(rawSQL);
    }
  }
};
</script>


<style scoped>
/* 添加样式 */
</style>