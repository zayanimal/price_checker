<template>
    <el-container>
        <el-main class="Main">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input
                        class="Main__input"
                        placeholder="Enter model"
                        v-model="input"
                    />
                    <el-table
                        v-if="input"
                        :data="filteredModels"
                        @cell-click="selectModel"
                        border
                    >
                        <el-table-column
                            label-class-name="Main__table-row"
                            class-name="Main__table-row"
                            prop="model"
                            label="Please select model"
                        />
                    </el-table>
                </el-col>
                <el-col :span="17">
                    <el-row :gutter="20">
                        <el-checkbox v-model="distiMargin" class="Main__checkbox">
                            3% наценки дистрибьютора
                        </el-checkbox>
                    </el-row>
                    <el-row class="Main_pb">
                        <el-table
                            v-if="showTable"
                            :data="checkedRows"
                        >
                            <el-table-column
                                min-width="100"
                                prop="model"
                                label="Model"
                            />
                            <el-table-column
                                prop="price"
                                label="DDP"
                            >
                                <template slot-scope="scope">
                                    {{ `$ ${formatNum(scope.row.price)}` }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                width="70"
                                prop="discount"
                                label="Disc"
                            >
                                <template slot-scope="scope">
                                    <el-input
                                        v-model="checkedRows[scope.$index].discount"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                width="70"
                                prop="margin"
                                label="Margin"
                            >
                                <template slot-scope="scope">
                                    <el-input
                                        v-model="checkedRows[scope.$index].margin"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="extUsd"
                                label="Ext $"
                            >
                                <template slot-scope="scope">
                                    {{ `$ ${formatNum(extUsd(scope.$index))}` }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                min-width="100"
                                prop="rub"
                                label="Ext Rub"
                            >
                                <template slot-scope="scope">
                                    {{ `${formatNum(extRub(scope.$index))} р.` }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                min-width="170"
                                prop="delivery"
                                label="Delivery"
                            >
                                <template slot-scope="scope">
                                    <el-input
                                        v-model="checkedRows[scope.$index].delivery"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="Action"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        @click="deleteRow(scope.$index, scope.row)"
                                    >
                                        <i class="el-icon-delete-solid"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row class="Main_pb">
                        <el-button @click="clipboard" v-if="showTable">Copy spec</el-button>
                    </el-row>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import models from '../assets/price.json'

export default {
    name: 'Price',
    data: () => ({
        input: '',
        alert: false,
        tableData: models,
        checkedRows: [],
        rate: 0,
        distiMargin: true
    }),
    computed: {
        showTable() {
            return this.input.length > 0 && this.checkedRows.length > 0 ? true : false;
        },
        filteredModels: function() {
            if (this.input !== '') {
                return this.tableData.filter(item => {
                    return item.model.indexOf(this.input.toUpperCase()) !== -1;
                });
            } else { return []; }
        }
    },
    methods: {
        selectModel(cell) {
            const { model, price } = cell;
            this.checkedRows.push({
                model,
                price,
                discount: 7,
                margin: 10,
                delivery: 'со склада в Рязани 3-4 дня'
            });
        },
        deleteRow(index) {
            this.checkedRows.splice(index, 1);
        },
        specInText() {
            let text = '';
            this.checkedRows.forEach((row, i) => {
                text += `${i+1}. ${row.model} - $${this.formatNum(this.extUsd(i))}  (${this.formatNum(this.extRub(i))}р.) - ${row.delivery} \n`;
            });
            return text;
        },
        clipboard() {
            navigator.clipboard.writeText(this.specInText())
                .then(() => {
                    this.$notify.success({
                        title: 'Specification copied',
                        message: 'Use Ctrl+V to paste it'
                    });
                })
        },
        extUsd(index) {
            const { price, discount, margin } = this.checkedRows[index];

            function factor(num, margin = false) {
                return margin ? 1 + num / 100 : 1 - num / 100;
            }

            return Number(price * (this.distiMargin ? 1.03 : 1) * factor(discount || 0) * factor(margin || 0, true));
        },
        extRub(index) {
            return this.extUsd(index) * this.rate;
        },
        formatNum(number) {
            return new Intl.NumberFormat('ru-RU').format(Number(number).toFixed(2));
        }
    },
    async created() {
        const res = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const json = await res.json();
        const rate = json.Valute.USD.Value;

        this.rate = rate;
    }
}
</script>
<style lang="scss" scoped>
</style>