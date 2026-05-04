import React from "react";
import {
  Alert,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMenu } from "../hooks/useMenu";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";
import { LoadingMask } from "../common/LoadingMask";
import { CourseType, MenuItem } from "../types/menu";
import { function as F } from "fp-ts";
import { option as O } from "fp-ts";

const CourseSection: React.FC<{
  courseType: CourseType;
  items: MenuItem[];
  index: number;
}> = ({ courseType, items, index }) => {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: index * 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h3"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "primary.main",
            textTransform: "capitalize"
          }}
        >
          {t(`sections.menu.courses.${courseType}`)}
        </Typography>

        <Divider sx={{ mb: 3, backgroundColor: "primary.light" }} />

        <Stack spacing={2}>
          {items.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    elevation: 3,
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <Typography
                  variant="subtitle1"
                  component="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "text.primary"
                  }}
                >
                  {item.name}
                </Typography>

                {item.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      mb: item.allergens.length > 0 ? 2 : 0,
                      color: "text.secondary",
                      lineHeight: 1.6
                    }}
                  >
                    {item.description}
                  </Typography>
                )}

                {item.allergens.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {item.allergens.map((allergen, index) => (
                      <Chip
                        key={index}
                        label={allergen}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "0.75rem",
                          height: "24px",
                          backgroundColor: "warning.light",
                          borderColor: "warning.main",
                          color: "warning.dark",
                          "&:hover": {
                            backgroundColor: "warning.main",
                            color: "white"
                          }
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Paper>
            </motion.div>
          ))}
        </Stack>
      </Box>
    </motion.div>
  );
};

export const MenuSection: React.FC = () => {
  const { t } = useTranslation();
  const { menuByCourse, loading, error } = useMenu();

  const courseOrder: CourseType[] = ['antipasto', 'primo', 'secondo', 'dolce', 'bevande'];

  return F.pipe(
    error,
    O.fold(
      () => (
        <SectionContainer>
          {loading ? (
            <LoadingMask />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Stack direction="column" alignItems="center" spacing={4}>
                <SectionHeader
                  imgSrc="../sections/restaurant.png"
                  altImage={t("sections.menu.altImage")}
                  title={t("sections.menu.title")}
                />

                <Typography
                  variant="h6"
                  textAlign="center"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    maxWidth: "600px",
                    lineHeight: 1.6
                  }}
                >
                  {t("sections.menu.subtitle")}
                </Typography>

                <Box sx={{ width: "100%", maxWidth: "800px" }}>
                  {courseOrder.map((courseType, index) => (
                    <CourseSection
                      key={courseType}
                      courseType={courseType}
                      items={menuByCourse[courseType]}
                      index={index}
                    />
                  ))}
                </Box>
              </Stack>
            </motion.div>
          )}
        </SectionContainer>
      ),
      (err) => (
        <SectionContainer>
          <Alert severity="error" sx={{ m: 2 }}>
            <Typography variant="h6">{t("sections.menu.loadError")}</Typography>
            <Typography variant="body2">{err.message}</Typography>
          </Alert>
        </SectionContainer>
      )
    )
  );
};