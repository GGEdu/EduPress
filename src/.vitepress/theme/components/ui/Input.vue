<script setup lang="ts">

/**
 * Input - Componente de campo de entrada
 * 
 * FASE 7: Componentes UI Reutilizables
 * - Múltiples tipos (text, email, password, number, etc.)
 * - 3 tamaños
 * - Estados: error, disabled, readonly
 * - Slots para prefix y suffix
 * - Clearable opcional
 * - Label y helper text
 * 
 * @example
 * <Input
 *   v-model="email"
 *   type="email"
 *   label="Email"
 *   placeholder="tu@email.com"
 *   required
 * />
 * 
 * @example
 * <Input
 *   v-model="search"
 *   prefix="🔍"
 *   :clearable="true"
 *   placeholder="Buscar..."
 * />
 */

import { ref, computed, getCurrentInstance, useSlots } from 'vue'

const props = defineProps({
  /**
   * Valor del input (v-model)
   */
  modelValue: {
    type: [String, Number],
    default: ''
  },
  
  /**
   * Tipo de input
   */
  type: {
    type: String,
    default: 'text'
  },
  
  /**
   * Tamaño del input
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  /**
   * Label del input
   */
  label: {
    type: String,
    default: ''
  },
  
  /**
   * Placeholder
   */
  placeholder: {
    type: String,
    default: ''
  },
  
  /**
   * Texto de ayuda
   */
  helperText: {
    type: String,
    default: ''
  },
  
  /**
   * Mensaje de error
   */
  errorMessage: {
    type: String,
    default: ''
  },
  
  /**
   * Prefijo (icono o texto)
   */
  prefix: {
    type: String,
    default: ''
  },
  
  /**
   * Sufijo (icono o texto)
   */
  suffix: {
    type: String,
    default: ''
  },
  
  /**
   * Input deshabilitado
   */
  disabled: {
    type: Boolean,
    default: false
  },
  
  /**
   * Input solo lectura
   */
  readonly: {
    type: Boolean,
    default: false
  },
  
  /**
   * Input requerido
   */
  required: {
    type: Boolean,
    default: false
  },
  
  /**
   * Mostrar botón de limpiar
   */
  clearable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'clear', 'enter'])
const slots = useSlots()

// Refs
const inputRef = ref(null)
const isFocused = ref(false)

// ID único para el input
const instance = getCurrentInstance()
const inputId = computed(() => `input-${instance?.uid || Math.random()}`)

// ID para helper text (accesibilidad)
const helperTextId = computed(() => `${inputId.value}-helper`)

// Clases del wrapper
const wrapperClasses = computed(() => {
  return [
    `input-size-${props.size}`,
    {
      'input-disabled': props.disabled,
      'input-error': props.errorMessage,
      'input-focused': isFocused.value
    }
  ]
})

// Clases del input
const inputClasses = computed(() => {
  return {
    'has-prefix': slots.prefix || props.prefix,
    'has-suffix': slots.suffix || props.suffix || props.clearable
  }
})

// Handlers
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const handleEnter = (event) => {
  emit('enter', event)
}

// Exponer el ref del input
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
})

</script>

<template>

  <div
    class="input-wrapper"
    :class="wrapperClasses">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="input-label">
      {{ label }}
      <span v-if="required" class="input-required" aria-label="requerido">*</span>
    </label>
    
    <!-- Input container -->
    <div class="input-container">
      <!-- Prefix icon/text -->
      <span 
        v-if="$slots.prefix || prefix" 
        class="input-prefix"
        aria-hidden="true">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      
      <!-- Input field -->
      <input
        :id="inputId"
        ref="inputRef"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="!!errorMessage"
        :aria-required="required"
        :aria-describedby="helperTextId"
        :class="inputClasses"
        class="input-field"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
      />
      
      <!-- Suffix icon/text -->
      <span 
        v-if="$slots.suffix || suffix" 
        class="input-suffix"
        aria-hidden="true">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
      
      <!-- Clear button -->
      <button
        v-if="clearable && modelValue"
        type="button"
        class="input-clear"
        @click="handleClear"
        aria-label="Limpiar campo">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    
    <!-- Helper text o error -->
    <div 
      v-if="helperText || errorMessage" 
      :id="helperTextId"
      class="input-helper"
      :role="errorMessage ? 'alert' : undefined"
      :aria-live="errorMessage ? 'polite' : undefined">
      <span v-if="errorMessage" class="input-error-message">
        <span class="sr-only">Error: </span>{{ errorMessage }}
      </span>
      <span v-else class="input-helper-text">{{ helperText }}</span>
    </div>
  </div>

</template>

<style scoped>

/* ============================================================================
 * Input Component - Estilos base
 * ============================================================================ */

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--custom-space-2);
}

/* ============================================================================
 * Label
 * ============================================================================ */

.input-label {
  display: block;
  font-size: var(--custom-font-size-sm);
  font-weight: var(--custom-font-weight-medium);
  color: var(--vp-c-text-1);
  line-height: var(--custom-line-height-tight);
}

.input-required {
  color: var(--vp-c-red-1);
  margin-left: 2px;
}

/* ============================================================================
 * Input Container
 * ============================================================================ */

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--custom-radius-md);
  transition: all var(--custom-transition-fast);
}

.input-container:hover:not(.input-disabled .input-container) {
  border-color: var(--vp-c-brand-light);
}

.input-focused .input-container {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.input-error .input-container {
  border-color: var(--vp-c-red-1);
}

.input-error.input-focused .input-container {
  box-shadow: 0 0 0 3px var(--vp-c-red-soft);
}

.input-disabled .input-container {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-divider);
  cursor: not-allowed;
  opacity: var(--custom-opacity-disabled, 0.6);
}

/* ============================================================================
 * Input Field
 * ============================================================================ */

.input-field {
  flex: 1;
  min-width: 0;
  font-family: var(--vp-font-family-base);
  font-size: var(--custom-font-size-base);
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  outline: none;
  transition: all var(--custom-transition-fast);
}

.input-field::placeholder {
  color: var(--vp-c-text-3);
}

.input-field:disabled {
  cursor: not-allowed;
}

/* ============================================================================
 * Tamaños
 * ============================================================================ */

.input-size-sm .input-field {
  padding: var(--custom-space-2) var(--custom-space-3);
  font-size: var(--custom-font-size-sm);
}

.input-size-md .input-field {
  padding: var(--custom-space-3) var(--custom-space-4);
  font-size: var(--custom-font-size-base);
}

.input-size-lg .input-field {
  padding: var(--custom-space-4) var(--custom-space-5);
  font-size: var(--custom-font-size-lg);
}

/* ============================================================================
 * Prefix y Suffix
 * ============================================================================ */

.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
  user-select: none;
}

.input-size-sm .input-prefix {
  padding-left: var(--custom-space-3);
  font-size: var(--custom-font-size-sm);
}

.input-size-md .input-prefix {
  padding-left: var(--custom-space-4);
  font-size: var(--custom-font-size-base);
}

.input-size-lg .input-prefix {
  padding-left: var(--custom-space-5);
  font-size: var(--custom-font-size-lg);
}

.input-size-sm .input-suffix {
  padding-right: var(--custom-space-3);
  font-size: var(--custom-font-size-sm);
}

.input-size-md .input-suffix {
  padding-right: var(--custom-space-4);
  font-size: var(--custom-font-size-base);
}

.input-size-lg .input-suffix {
  padding-right: var(--custom-space-5);
  font-size: var(--custom-font-size-lg);
}

/* Ajustar padding del input si hay prefix/suffix */
.input-field.has-prefix {
  padding-left: 0;
}

.input-field.has-suffix {
  padding-right: 0;
}

/* ============================================================================
 * Clear Button
 * ============================================================================ */

.input-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--custom-space-3);
  background: transparent;
  border: none;
  color: var(--vp-c-text-3);
  font-size: 1.5em;
  line-height: 1;
  cursor: pointer;
  transition: color var(--custom-transition-fast);
}

.input-clear:hover {
  color: var(--vp-c-text-1);
}

.input-size-lg .input-clear {
  padding: 0 var(--custom-space-4);
  font-size: 1.8em;
}

/* ============================================================================
 * Helper Text y Error
 * ============================================================================ */

.input-helper {
  min-height: calc(var(--custom-font-size-xs) * var(--custom-line-height-normal));
}

.input-helper-text {
  font-size: var(--custom-font-size-xs);
  color: var(--vp-c-text-2);
  line-height: var(--custom-line-height-normal);
}

.input-error {
  font-size: var(--custom-font-size-xs);
  color: var(--vp-c-red-1);
  line-height: var(--custom-line-height-normal);
  font-weight: var(--custom-font-weight-medium);
}

/* ============================================================================
 * Tipos específicos
 * ============================================================================ */

/* Number input - ocultar spinner */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Password input */
input[type="password"] {
  letter-spacing: 0.1em;
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

/* Mobile Small (max-width: 480px) */
@media (max-width: 480px) {
  .input-wrapper {
    /* Inputs de ancho completo en móvil */
    width: 100%;
  }
  
  .input-size-sm .input-field {
    padding: var(--custom-space-1) var(--custom-space-2);
    font-size: var(--custom-font-size-xs);
  }
  
  .input-size-md .input-field {
    padding: var(--custom-space-2) var(--custom-space-3);
    font-size: var(--custom-font-size-sm);
  }
  
  .input-size-lg .input-field {
    padding: var(--custom-space-2) var(--custom-space-3);
    font-size: var(--custom-font-size-sm);
  }
  
  .input-label {
    font-size: var(--custom-font-size-sm);
  }
  
  .input-help-text,
  .input-error-message {
    font-size: var(--custom-font-size-xs);
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .input-size-lg .input-field {
    padding: var(--custom-space-3) var(--custom-space-4);
    font-size: var(--custom-font-size-base);
  }
}

</style>
