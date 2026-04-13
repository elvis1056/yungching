"use client";

import { useState } from "react";
import type { Attraction } from "@/types/attraction";
import styles from "./EditFavoriteModal.module.scss";

interface FormValues {
  name: string;
  tel: string;
  address: string;
}

interface FormErrors {
  name?: string;
  tel?: string;
}

interface Props {
  attraction: Attraction;
  onSave: (id: string, data: Partial<Attraction>) => void;
  onClose: () => void;
}

const CHINESE_PATTERN = /[\u4e00-\u9fff\u3400-\u4dbf]/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "景點名稱為必填";
  }

  if (values.tel && CHINESE_PATTERN.test(values.tel)) {
    errors.tel = "電話不可輸入中文";
  }

  return errors;
}

export default function EditFavoriteModal({ attraction, onSave, onClose }: Props) {
  const [values, setValues] = useState<FormValues>({
    name: attraction.name,
    tel: attraction.tel,
    address: attraction.address,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(values);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(attraction.id, {
      name: values.name.trim(),
      tel: values.tel.trim(),
      address: values.address.trim(),
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>編輯景點資訊</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>
              景點名稱<span className={styles.required}>*</span>
            </label>
            <input
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              name="name"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>電話</label>
            <input
              className={`${styles.input} ${errors.tel ? styles.inputError : ""}`}
              name="tel"
              value={values.tel}
              onChange={handleChange}
            />
            {errors.tel && <p className={styles.errorMsg}>{errors.tel}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>地址</label>
            <input
              className={styles.input}
              name="address"
              value={values.address}
              onChange={handleChange}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              取消
            </button>
            <button type="submit" className={styles.submitButton}>
              儲存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
