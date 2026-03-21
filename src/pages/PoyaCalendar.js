import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Popover,
    Stack,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../services/api";

const PoyaCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Desktop hover popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverItem, setPopoverItem] = useState(null);

    // Mobile / click dialog
    const [dialogItem, setDialogItem] = useState(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await api.get("/poya");
            setItems(res.data || []);
        } catch (err) {
            console.error(err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const monthName = currentMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const buildCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const weeks = [];
        const current = new Date(firstDayOfMonth);
        current.setDate(current.getDate() - current.getDay());

        while (current <= lastDayOfMonth || current.getDay() !== 0) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
            if (current > lastDayOfMonth && current.getDay() === 0) break;
        }

        return weeks;
    };

    const weeks = buildCalendar();

    const getItemsForDate = useMemo(() => {
        return (dateObj) => {
            const yyyyMmDd = dateObj.toISOString().substring(0, 10);
            return items.filter((item) => item.date === yyyyMmDd);
        };
    }, [items]);

    // Desktop hover
    const handleHoverOpen = (event, item) => {
        setAnchorEl(event.currentTarget);
        setPopoverItem(item);
    };

    const handleHoverClose = () => {
        setAnchorEl(null);
        setPopoverItem(null);
    };

    // Touch / click
    const handleDialogOpen = (item) => {
        setDialogItem(item);
    };

    const handleDialogClose = () => {
        setDialogItem(null);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top left, rgba(140,90,255,0.14) 0%, rgba(140,90,255,0) 32%), linear-gradient(180deg, #17003a 0%, #12052b 100%)",
                py: 6,
                px: 2,
            }}
        >
            <Box sx={{ maxWidth: 1100, mx: "auto" }}>
                <Typography
                    sx={{
                        fontFamily: `"Cormorant Garamond","Georgia","Times New Roman",serif`,
                        color: "#f2ebff",
                        fontSize: { xs: "2.5rem", md: "4rem" },
                        lineHeight: 1,
                        mb: 2,
                        textAlign: "center",
                    }}
                >
                    Poya Calender
                </Typography>

                <Typography
                    sx={{
                        color: "rgba(255,255,255,0.72)",
                        textAlign: "center",
                        mb: 4,
                    }}
                >
                    View Poya day subjects. Hover on desktop or tap on mobile to read the description.
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: 4,
                        backdropFilter: "blur(8px)",
                        overflow: "hidden",
                        p: { xs: 2, md: 3 },
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 3 }}
                    >
                        <Button
                            onClick={() =>
                                setCurrentMonth(
                                    new Date(
                                        currentMonth.getFullYear(),
                                        currentMonth.getMonth() - 1,
                                        1
                                    )
                                )
                            }
                            sx={{
                                color: "#f0c34a",
                                textTransform: "none",
                                borderRadius: 999,
                            }}
                        >
                            Prev
                        </Button>

                        <Typography
                            sx={{
                                color: "#fff",
                                fontSize: 22,
                                fontWeight: 700,
                            }}
                        >
                            {monthName}
                        </Typography>

                        <Button
                            onClick={() =>
                                setCurrentMonth(
                                    new Date(
                                        currentMonth.getFullYear(),
                                        currentMonth.getMonth() + 1,
                                        1
                                    )
                                )
                            }
                            sx={{
                                color: "#f0c34a",
                                textTransform: "none",
                                borderRadius: 999,
                            }}
                        >
                            Next
                        </Button>
                    </Stack>

                    {loading ? (
                        <Box sx={{ py: 8, textAlign: "center" }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(7, 1fr)",
                                gap: 1,
                                borderTop: "1px solid rgba(255,255,255,0.12)",
                                borderLeft: "1px solid rgba(255,255,255,0.12)",
                            }}
                        >
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <Box
                                    key={day}
                                    sx={{
                                        textAlign: "center",
                                        py: 1,
                                        color: "#fff",
                                        fontWeight: 700,
                                        borderRight: "1px solid rgba(255,255,255,0.12)",
                                        borderBottom: "1px solid rgba(255,255,255,0.12)",
                                        backgroundColor: "rgba(255,255,255,0.04)",
                                    }}
                                >
                                    {day}
                                </Box>
                            ))}

                            {weeks.map((week, wi) => (
                                <React.Fragment key={wi}>
                                    {week.map((dateObj, di) => {
                                        const inCurrentMonth =
                                            dateObj.getMonth() === currentMonth.getMonth();
                                        const dayItems = getItemsForDate(dateObj);

                                        return (
                                            <Box
                                                key={di}
                                                sx={{
                                                    minHeight: 120,
                                                    p: 1,
                                                    borderRight: "1px solid rgba(255,255,255,0.12)",
                                                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                                                    backgroundColor: !inCurrentMonth
                                                        ? "rgba(255,255,255,0.02)"
                                                        : "transparent",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 12,
                                                        mb: 1,
                                                        color: inCurrentMonth
                                                            ? "#ffffff"
                                                            : "rgba(255,255,255,0.35)",
                                                    }}
                                                >
                                                    {dateObj.getDate()}
                                                </Typography>

                                                <Stack spacing={0.8}>
                                                    {dayItems.map((item) => (
                                                        <Chip
                                                            key={item.id}
                                                            label={item.subject}
                                                            onMouseEnter={(e) => handleHoverOpen(e, item)}
                                                            onClick={() => handleDialogOpen(item)}
                                                            sx={{
                                                                justifyContent: "flex-start",
                                                                height: "auto",
                                                                py: 0.5,
                                                                backgroundColor: "rgba(240,195,74,0.18)",
                                                                color: "#fff",
                                                                border: "1px solid rgba(240,195,74,0.22)",
                                                                "& .MuiChip-label": {
                                                                    whiteSpace: "normal",
                                                                    fontWeight: 600,
                                                                    px: 1,
                                                                },
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </Box>
                    )}
                </Paper>

                {/* Desktop hover popover */}
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleHoverClose}
                    disableRestoreFocus
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    PaperProps={{
                        onMouseEnter: () => { },
                        onMouseLeave: handleHoverClose,
                        sx: {
                            p: 2,
                            maxWidth: 320,
                            backgroundColor: "#1b0a3b",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.12)",
                        },
                    }}
                >
                    {popoverItem && (
                        <>
                            <Typography sx={{ fontWeight: 700, mb: 1 }}>
                                {popoverItem.subject}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.78)" }}>
                                {popoverItem.description}
                            </Typography>
                        </>
                    )}
                </Popover>

                {/* Mobile / click dialog */}
                <Dialog
                    open={Boolean(dialogItem)}
                    onClose={handleDialogClose}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            backgroundColor: "#1b0a3b",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.12)",
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            color: "#fff",
                        }}
                    >
                        {dialogItem?.subject || "Poya Detail"}
                        <IconButton onClick={handleDialogClose} sx={{ color: "#fff" }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent>
                        <Typography sx={{ color: "rgba(255,255,255,0.82)" }}>
                            {dialogItem?.description || ""}
                        </Typography>
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
};

export default PoyaCalendar;