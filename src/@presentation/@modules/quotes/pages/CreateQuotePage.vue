<template>
  <MainLayout>
    <v-container>
      <v-card
        class="rounded-lg"
        outlined
      >
        <v-card-title class="text-h5">
          Créer un Devis
        </v-card-title>
        
        <v-card-text>
          <!-- Informations du devis -->
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="quote.quoteNumber"
                label="Numéro de devis"
                readonly
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="quote.date"
                label="Date"
                type="date"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="quote.validUntil"
                label="Validité jusqu'à"
                type="date"
                outlined
              />
            </v-col>
          </v-row>
          
          <!-- Informations du Technicien et du Garage -->
          <v-row>
            <v-col md="6">
              <v-card
                outlined
                class="pa-4"
              >
                <div class="d-flex justify-space-between">
                  <div>
                    <h5 class="text-h6">
                      From:
                    </h5>
                    <p class="mb-0">
                      <strong>{{ quote.technician?.name || 'Sélectionner un technicien' }}</strong>
                    </p>
                    <p
                      v-if="quote.technician"
                      class="mb-0"
                    >
                      {{ quote.technician.email }}
                    </p>
                    <p
                      v-if="quote.technician"
                      class="mb-0"
                    >
                      {{ quote.technician.phone }}
                    </p>
                  </div>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    @click="selectTechnician"
                  >
                    Changer
                  </v-btn>
                </div>
              </v-card>
            </v-col>
            
            <v-col md="6">
              <v-card
                outlined
                class="pa-4"
              >
                <div class="d-flex justify-space-between">
                  <div>
                    <h5 class="text-h6">
                      To:
                    </h5>
                    <p class="mb-0">
                      <strong>{{ quote.garage?.name || 'Ajouter un garage' }}</strong>
                    </p>
                    <p
                      v-if="quote.garage"
                      class="mb-0"
                    >
                      {{ quote.garage.address }}
                    </p>
                    <p
                      v-if="quote.garage"
                      class="mb-0"
                    >
                      {{ quote.garage.phone }}
                    </p>
                  </div>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    @click="selectGarage"
                  >
                    {{ quote.garage ? 'Changer' : 'Ajouter' }}
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-divider class="my-4" />
        
        <!-- Tableau des éléments du devis -->
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="quote.items"
            class="elevation-1"
          >
            <template #item.name="{ item }">
              <v-text-field
                v-model="item.name"
                placeholder="Nom de l'élément"
                dense
                outlined
              />
            </template>
            <template #item.description="{ item }">
              <v-text-field
                v-model="item.description"
                placeholder="Description"
                dense
                outlined
              />
            </template>
            <template #item.qty="{ item }">
              <v-text-field
                v-model.number="item.qty"
                type="number"
                placeholder="Quantité"
                dense
                outlined
              />
            </template>
            <template #item.price="{ item }">
              <v-text-field
                v-model.number="item.price"
                type="number"
                placeholder="Prix Unitaire"
                dense
                outlined
              />
            </template>
            <template #item.total="{ item }">
              <p class="text-right">
                {{ (item.qty * item.price).toFixed(2) }} €
              </p>
            </template>
            <template #item.actions="{ item }">
              <v-icon
                class="me-2"
                size="small"
                @click="removeItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
          <v-btn
            class="mt-3"
            color="primary"
            @click="addItem"
          >
            + Ajouter un élément
          </v-btn>
        </v-card-text>
        
        <v-divider class="my-4" />
        
        <!-- Bloc des Totaux -->
        <v-sheet class="rounded-sm bg-lightprimary pa-2 pa-sm-6">
          <v-row justify="end">
            <v-col
              cols="6"
              sm="3"
              md="2"
              class="text-end"
            >
              <h5 class="py-2 text-subtitle-1">
                Sub Total :
              </h5>
              <h5 class="py-2 text-subtitle-1 text-no-wrap">
                Taxes (10%) :
              </h5>
              <h5 class="py-2 text-subtitle-1 text-no-wrap">
                Discount (5%) :
              </h5>
              <h5 class="py-2 text-subtitle-1 text-primary mt-7">
                Total
              </h5>
            </v-col>
            <v-col
              cols="6"
              sm="3"
              md="2"
              class="text-end"
            >
              <h5 class="py-2 text-subtitle-1 text-disabled">
                {{ subtotal.toFixed(2) }} €
              </h5>
              <h5 class="py-2 text-subtitle-1 text-disabled">
                {{ tax.toFixed(2) }} €
              </h5>
              <h5 class="py-2 text-subtitle-1 text-disabled">
                {{ discount.toFixed(2) }} €
              </h5>
              <h5 class="py-2 text-subtitle-1 text-primary mt-7">
                {{ total.toFixed(2) }} €
              </h5>
            </v-col>
          </v-row>
        </v-sheet>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { computed, ref } from 'vue';

const quote = ref({
  quoteNumber: `Q-${Date.now()}`,
  date: new Date().toISOString().split('T')[0],
  validUntil: '',
  technician: null,
  garage: null,
  items: [],
});

const headers = [
  { title: 'Nom', key: 'name', align: 'start' },
  { title: 'Description', key: 'description' },
  { title: 'Quantité', key: 'qty' },
  { title: 'Prix Unitaire (€)', key: 'price' },
  { title: 'Total (€)', key: 'total' },
  { title: 'Actions', key: 'actions', sortable: false }
];

const subtotal = computed(() => quote.value.items.reduce((sum, item) => sum + (item.qty * item.price || 0), 0));
const tax = computed(() => subtotal.value * 0.10);
const discount = computed(() => subtotal.value * 0.05);
const total = computed(() => subtotal.value + tax.value - discount.value);

const addItem = () => {
  quote.value.items.push({ name: '', description: '', qty: 1, price: 0 });
};

const removeItem = (item) => {
  quote.value.items = quote.value.items.filter(i => i !== item);
};

const selectTechnician = () => {
  console.log('Sélectionner un technicien');
};

const selectGarage = () => {
  console.log('Sélectionner un garage');
};
</script>
