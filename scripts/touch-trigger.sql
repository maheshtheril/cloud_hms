
DROP TRIGGER IF EXISTS trg_hms_touch_invoice_from_line ON public.hms_invoice_lines;
CREATE TRIGGER trg_hms_touch_invoice_from_line AFTER INSERT OR DELETE OR UPDATE ON public.hms_invoice_lines FOR EACH ROW EXECUTE FUNCTION public.hms_touch_invoice_from_line();
