# 🚦 Quick Start Guide - Video Analytics System

## Overview
This guide helps you quickly get started with the AI-Powered Traffic Video Analytics System.

---

## 🎯 Quick Navigation

### From Dashboard
1. Open the main **Dashboard**
2. In the left sidebar, click **"AI Video Analytics"**
3. Follow the 6-step workflow

### Direct Access
- **URL:** `/video-analytics`
- **Alternative:** Click "Video Upload" → Follow workflow

---

## 📹 Step-by-Step Workflow

### **Step 1: Upload Video** 📹
```
Action: Upload your surveillance video
Supported Formats: MP4, AVI, MOV, MKV
Max Size: 500MB per file
```

**How:**
- Click "Select Videos" button OR
- Drag and drop video file
- Wait for upload to complete ✓

**What Happens:**
- File validated
- Metadata extracted
- Preview available

---

### **Step 2: Define ROI** 📍
```
Action: Mark queue region and stop line
Purpose: Locate analysis area on road
```

**How:**
1. Click **"Queue Region"** button
2. Click on canvas to add polygon points
3. Double-click to finish (need ≥3 points)
4. Click **"Stop Line"** button  
5. Click to add line points
6. Double-click to finish (need ≥2 points)
7. Click **"Save ROI"**

**Tips:**
- Use grid for accuracy
- Click "Show Info" for instructions
- Queue region = area before signal
- Stop line = where vehicles should stop

---

### **Step 3: Process Video** ⚡
```
Action: Run AI analysis pipeline
Time: Depends on video length (simulated)
```

**What Happens:**
1. **Vehicle Detection** (25%)
   - Identifies all vehicles in each frame
   - Classifies by type
2. **Multi-Object Tracking** (25%)
   - Assigns unique IDs to vehicles
   - Tracks across frames
3. **Queue Analysis** (25%)
   - Measures queue length
   - Calculates density
4. **Violation Detection** (25%)
   - Finds rule violations
   - Assesses risk level

Click **"Start Analysis"** to begin.

---

### **Step 4: View Detection Results** 📊
```
Tab: Detections
Shows: Vehicle detection statistics
```

**Key Metrics:**
- Total Detections
- Average Confidence
- Vehicle Classes (5 types)
- Confidence Distribution

**Features:**
- Click on vehicle class for details
- View frame-by-frame breakdown
- Export detection data

---

### **Step 5: Review Tracking** 🔄
```
Tab: Tracking
Shows: Vehicle trajectories and movement
```

**Key Metrics:**
- Total Tracks
- Track Details
- Velocity Vectors

**Features:**
- Toggle trajectory visibility
- Show/hide velocity vectors
- Click track for detailed analysis
- View trajectory statistics

---

### **Step 6: Analyze Violations** 🚨
```
Tab: Violations
Shows: Detected traffic rule violations
```

**Violation Types:**
- 🚨 Red-Light Jump
- ⚡ Rash Driving
- 🛣️ Lane Violation

**Risk Levels:**
- 🔴 **Critical** (confidence ≥ 90%)
- 🟠 **High** (confidence 75-90%)
- 🟡 **Medium** (confidence < 75%)

**Features:**
- Filter by confidence threshold
- Sort by risk level
- View detailed incident info
- Export violation report

---

## 🎮 Key Controls

### Canvas Interactions (ROI Editor)
| Action | Result |
|--------|--------|
| Click | Add point to current region |
| Double-click | Finish drawing |
| Press Enter | Finish drawing |
| Press Escape | Cancel drawing |
| Space + Scroll | Pan canvas |

### Tab Navigation
| Tab | Prerequisite |
|-----|--------------|
| Upload | None |
| ROI | Video uploaded |
| Processing | ROI defined |
| Detection | Analysis complete |
| Tracking | Analysis complete |
| Violations | Analysis complete |

---

## 📊 Understanding the Results

### Detection Metrics Explained
```
Total Detections: Sum of all vehicle detections
Avg Confidence: Average reliability of detections (0-100%)
Vehicle Classes: 5 types with count and percentage
Confidence Distribution: Graph showing confidence ranges
```

### Queue Metrics Explained
```
Queue Length: Number of vehicles waiting
Queue Density: Vehicles per unit area (0.0-1.0)
Avg Speed: Average velocity of vehicles
```

### Violation Metrics Explained
```
Total Violations: All detected violations
Critical Risk: High confidence violations
Avg Confidence: Average certainty of violations
Unique Vehicles: Count of violating vehicles
```

---

## 🎨 UI Features

### Progress Tracking
- Green circle ✓ = Completed
- Blue circle 🔵 = Active
- Gray circle ⊘ = Locked

### Data Visualization
- **Bar Charts:** Statistics breakdown
- **Progress Bars:** Metrics representation
- **Canvas:** Custom trajectory rendering
- **Timeline:** Frame-by-frame analysis

### Export Options
- Download Detection Report
- Download Tracking Data
- Download Violation Report
- PDF Summary (coming soon)

---

## 💡 Tips & Tricks

### For Better Results
1. **Clear Videos:** Ensure good lighting
2. **Proper ROI:** Mark queue region accurately
3. **Multiple Uploads:** Test different intersections
4. **Confidence Filter:** Adjust for precision vs recall

### Navigation Shortcuts
- Click tab name to jump to section
- Scroll to see more details
- Use "Back" button to return to dashboard
- Refresh page to start over

### Understanding Confidence
```
High Confidence (90%+) = Very reliable detection
Good Confidence (75-90%) = Generally reliable
Low Confidence (<75%) = Use with caution
```

---

## ⚙️ Configuration Options

### Canvas Tools (ROI Editor)
- ✓ Show Grid - Grid overlay for precision
- ✓ Show Info - Display on-screen instructions

### Visualization Options (Tracking)
- ✓ Show Trajectories - Vehicle paths
- ✓ Show Velocity Vectors - Movement direction

### Filter Options (Violations)
- Confidence Threshold - 0-100%
- Risk Level Filter - Critical/High/Medium

---

## 🚀 Advanced Usage

### Analyzing Multiple Videos
1. Complete analysis of first video
2. Return to dashboard
3. Click "AI Video Analytics" again
4. Upload new video
5. Results are independent

### Exporting Data
- Each tab has "Download Report" button
- Data format: JSON/CSV (coming soon)
- Reports include timestamps and confidence

### Comparing Results
- Run same video with different ROI
- Compare detection confidence
- Evaluate violation patterns

---

## 🐛 Troubleshooting

### Video Won't Upload
- Check file format (MP4, AVI, MOV, MKV)
- Verify file size (max 500MB)
- Try different browser

### Analysis Won't Start
- Ensure ROI is properly defined
- Check browser console for errors
- Refresh page and retry

### Canvas Not Responding
- Click "Show Info" to verify mode
- Press Escape to cancel current drawing
- Refresh if issues persist

### Data Not Displaying
- Ensure analysis is complete (✓ checkmark)
- Click correct tab
- Scroll down for more results

---

## 📱 Mobile/Responsive

### Desktop (Recommended)
- Full features available
- Optimal visualization
- Best performance

### Tablet
- Most features working
- Canvas may need adjustment
- Touch-friendly controls

### Mobile
- Limited functionality
- Canvas editing challenging
- View-only mode recommended

---

## 🎓 Learning Resources

### Documentation
- **Full Guide:** `/VIDEO_ANALYTICS_DOCUMENTATION.md`
- **Project Summary:** `/PROJECT_COMPLETION_SUMMARY.md`
- **Code Comments:** In component files

### Example Workflows
1. **Basic Upload:** Upload video → View detections
2. **Full Analysis:** Upload → ROI → Process → Analyze
3. **Comparison:** Same video, different ROI

---

## ❓ FAQ

**Q: What if detection misses some vehicles?**
- Check confidence threshold
- Verify video quality
- ROI might be limiting view

**Q: How accurate is violation detection?**
- Confidence score indicates reliability
- High confidence (90%+) most accurate
- Verify results with video review

**Q: Can I process live CCTV feeds?**
- Currently for pre-recorded videos
- Real-time processing in development
- Coming in Phase 2

**Q: How long does processing take?**
- Depends on video length
- Typically 30-60 seconds for 1-minute video
- Simulated for demo purposes

**Q: Can I re-analyze same video?**
- Yes, upload anew for fresh analysis
- Previous results stored separately
- Each analysis independent

---

## 🎉 You're Ready!

Your video analytics system is now ready to use. Start by:

1. Go to Dashboard
2. Click "AI Video Analytics"
3. Upload a video
4. Follow the 6-step workflow
5. Explore your results!

---

**Need Help?** Check the full documentation or contact support.

**Happy Analyzing! 🚦📊**

