export const doDateRangesOverlap = (
  {start1Str, end1Str, start2Str, end2Str}  
  : {start1Str: Date,
    end1Str: Date,
    start2Str: Date,
    end2Str: Date}
  ): boolean => {
    const start1 = new Date(start1Str);
    const end1 = new Date(end1Str);
    const start2 = new Date(start2Str);
    const end2 = new Date(end2Str);
  
    // Normalize to just dates (ignore time)
    const s1 = new Date(start1.getFullYear(), start1.getMonth(), start1.getDate());
    const e1 = new Date(end1.getFullYear(), end1.getMonth(), end1.getDate());
    const s2 = new Date(start2.getFullYear(), start2.getMonth(), start2.getDate());
    const e2 = new Date(end2.getFullYear(), end2.getMonth(), end2.getDate());
  
    // Return true if there is overlap
    return !(e1 < s2 || e2 < s1);
  };